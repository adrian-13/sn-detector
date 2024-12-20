'use client';

import React, { useState } from 'react';
import { Upload, Camera } from 'lucide-react';

interface SerialNumber {
  sn: string;
  confidencePercent: number;
}

interface FailedCandidate {
  candidate: string;
  reasons: string[];
}

interface AnalysisResults {
  serialNumbers: SerialNumber[];
  failedCandidates: FailedCandidate[];
  caption?: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError('');
      setResults(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Prosím, vyberte obrázok na analýzu');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analýza zlyhala');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neočakávaná chyba');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Detektor sériových čísel
          </h1>
          <p className="text-gray-600">
            Nahrajte obrázok a nechajte AI nájsť sériové čísla
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <label
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50"
              >
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mb-4 rounded"
                    />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mb-4 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Kliknite pre nahratie</span> alebo pretiahnite súbor sem
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !file}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Analyzujem...
                </div>
              ) : (
                <>
                  <Camera className="mr-2 h-5 w-5" />
                  Analyzovať obrázok
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {results && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Výsledky analýzy</h2>
            {results.serialNumbers?.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {results.serialNumbers.map((sn, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105 hover:bg-blue-50"
                  >
                    <div className="text-lg font-medium text-gray-800">Sériové číslo: {sn.sn}</div>
                    <div className="text-sm text-gray-500">
                      Spoľahlivosť: <span className="font-semibold text-green-600">{sn.confidencePercent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Neboli nájdené žiadne sériové čísla.</p>
            )}

            {results.failedCandidates?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-red-600 mb-3">Nevalidné nálezy</h3>
                <div className="space-y-4">
                  {results.failedCandidates.map((candidate, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 rounded-md border border-red-200 shadow-sm transition-transform transform hover:scale-105"
                    >
                      <div className="font-medium text-red-700">Kandidát: {candidate.candidate}</div>
                      <div className="text-sm text-gray-500">
                        Dôvody: <span className="text-red-600">{candidate.reasons.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}