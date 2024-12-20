# Serial Number Detector

This project is designed to recognize serial numbers from uploaded images using artificial intelligence. It allows users to upload an image, analyze it, and display identified serial numbers along with their recognition confidence.

## Live Demo
A live demo of the project is available at: [https://sn-detector.vercel.app/](https://sn-detector.vercel.app/)

## Features
- **Image Upload**: Simple drag-and-drop or file selection to upload images.
- **Automatic Analysis**: Automatically analyzes the uploaded image and extracts serial numbers.
- **Flexible Serial Number Format**: The format of recognized serial numbers can be customized as needed (e.g., by modifying regular expressions or validation rules).
- **Clear Results**: Displays identified serial numbers and their confidence levels, along with reasons for invalid findings.

## Usage
1. Upload an image containing serial numbers.
2. Click the **Analyze Image** button.
3. Wait for the analysis results:
   - Serial numbers and their recognition confidence will be displayed.
   - Reasons for invalid findings will also be provided.

## Customizing Serial Number Format
The format of serial numbers is defined using a regular expression:

```typescript
const SN_REGEX = /(serial\s*no\.?)|(s\s*\/\?\s*n\.?)|(serial\s*number)|(serial\s*#)|(sn:?)/i;
```

If you need to adjust the recognition conditions, you can:
- Modify the regular expression (`SN_REGEX`) to match your desired format.
- Adjust the validation rules in the `isValidSN` function based on length, allowed characters, or other criteria.

## Technologies
- **React.js**: For the frontend application.
- **Node.js**: For backend processing.
- **Azure AI**: For image analysis and text extraction.
- **Tailwind CSS**: For design and styling.

## Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository-url.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm run dev
   ```
4. Open the application at [http://localhost:3000](http://localhost:3000).

## Customization
If you need to customize the project, you can:
- Change serial number validation rules in `route.tsx`.
- Modify the design in `Home.tsx` or Tailwind CSS classes.
- Update the backend endpoint for image analysis in `api/analyze`.

## Contributions
Contributions and suggestions for improvement are welcome! Please create a pull request or open an issue on GitHub.

---

This project was created to simplify the process of serial number identification and provides sufficient flexibility for customization based on specific requirements.
