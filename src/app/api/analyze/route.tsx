import { NextResponse } from 'next/server';
import { AzureKeyCredential } from '@azure/core-auth';
import createClient from '@azure-rest/ai-vision-image-analysis';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import unorm from 'unorm';


// Definícia typov pre výsledky
interface SerialNumber {
  sn: string;
  confidencePercent: number;
}

interface FailedCandidate {
  candidate: string;
  reasons: string[];
}

interface ValidationResult {
  isValid: boolean;
  reasons: string[];
}

interface ApiResponse {
  serialNumbers: SerialNumber[];
  failedCandidates: FailedCandidate[];
  caption?: string;
}

interface ImageAnalysisResult {
  readResult?: {
    blocks?: Array<{
      lines?: Array<{
        text: string;
        words?: Array<{
          confidence: number;
        }>;
      }>;
    }>;
  };
  captionResult?: {
    text: string;
  };
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse | { error: string }>> {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Save the file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join('/tmp', file.name);
    await writeFile(path, buffer);

    const endpoint = process.env.AZURE_ENDPOINT;
    const key = process.env.AZURE_KEY;

    if (!endpoint || !key) {
      return NextResponse.json(
        { error: 'Azure credentials not configured' },
        { status: 500 }
      );
    }

    const credential = new AzureKeyCredential(key);
    const client = createClient(endpoint, credential);

    const features: string[] = ['Caption', 'Read'];
    const CONFIDENCE_THRESHOLD = 50;
    const SN_REGEX = /(serial\s*no\.?)|(s\s*\/?\s*n\.?)|(serial\s*number)|(serial\s*#)|(sn:?)/i;

    const result = await client.path('/imageanalysis:analyze').post({
      body: buffer,
      queryParameters: { 
      features: features as ['Caption', 'Read']
    },
      contentType: 'application/octet-stream'
    });

    const iaResult = result.body as ImageAnalysisResult;
    const serialNumbers: SerialNumber[] = [];
    const failedCandidates: FailedCandidate[] = [];

    if (iaResult.readResult?.blocks) {
      for (const block of iaResult.readResult.blocks) {
        if (block.lines) {
          for (const line of block.lines) {
            let confidencePercentage = 0;
            if (line.words && line.words.length > 0) {
              confidencePercentage = Math.floor(line.words[0].confidence * 100);
            }

            const match = line.text.match(SN_REGEX);
            if (match) {
              const matchStr = match[0];
              const startIndex = line.text.toLowerCase().indexOf(matchStr.toLowerCase());
              let sn_candidate = line.text.slice(startIndex + matchStr.length).trim();

              sn_candidate = unorm.nfkd(sn_candidate)
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                .replace(/\s+/g, ' ')
                .trim();

              const validity = isValidSN(sn_candidate);
              if (validity.isValid) {
                const formatRegex = /^[A-Z0-9]{3}-[A-Z0-9]{4}-[A-Z0-9]{3}$/i;
                const validFormat = formatRegex.test(sn_candidate);

                if (validFormat || confidencePercentage >= CONFIDENCE_THRESHOLD) {
                  serialNumbers.push({
                    sn: sn_candidate,
                    confidencePercent: confidencePercentage
                  });
                } else {
                  failedCandidates.push({
                    candidate: sn_candidate,
                    reasons: validity.isValid ? 
                      [`Confidence (${confidencePercentage}%) is below the threshold (${CONFIDENCE_THRESHOLD}%)`] : 
                      validity.reasons
                  });
                }
              } else {
                failedCandidates.push({
                  candidate: sn_candidate,
                  reasons: validity.reasons
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      serialNumbers,
      failedCandidates,
      caption: iaResult.captionResult?.text
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

function isValidSN(sn: string): ValidationResult {
  const reasons: string[] = [];
  const trimmed = sn.trim();

  if (trimmed.length < 3 || trimmed.length > 30) {
    reasons.push(`The length must be between 3 and 30 characters. Current length: ${trimmed.length}`);
  }

  if (!/[A-Za-z0-9]/.test(trimmed)) {
    reasons.push("It must contain at least one alphanumeric character (letter or digit).");
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
}