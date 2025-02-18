# Urban-Sustainability-Calculator

## Overview
This calcualtor is an interactive sustainability analysis platform that allows users to assess the environmental impact of their construction projects in real-time. By leveraging AI (Gemini) and real-time data, users can drop a pin on a map, describe their planned construction, and receive an updated sustainability score with actionable recommendations.

## Features
- **Interactive Map** – Users can select any location to evaluate its sustainability.
- **Real-time Sustainability Scoring** – Factors like AQI, carbon footprint, biodiversity, and social impact are considered.
- **AI-Powered Insights** – Users enter their construction plans, and the sustainability score updates dynamically.
- **Gamification with Aura Points** – Encouraging Gen-Z to make eco-friendly choices with aura-based incentives.

## Tech Stack
- **Frontend:** Next.js (for interactive maps and UI)
- **Backend:** Flask (for API handling and AI integration)
- **AI Model:** Gemini AI - Gemini 2 (for sustainability analysis and impact prediction)
- **Data Sources:** AQI, carbon footprint datasets, urban sustainability reports
- **Real-time Processing:** WebSockets for seamless score updates

## Installation & Setup
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/go-green-or-cry.git
   cd go-green-or-cry
   ```
2. **Set Up Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   flask run
   ```
3. **Set Up Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Usage
1. Open the application in a browser.
2. Drop a pin on the map to select a location.
3. Enter your construction plan details in the provided text box.
4. View real-time sustainability score updates with recommendations.

## Troubleshooting
- If the sustainability score isn't updating, check backend logs for API errors.
- For Gemini API response issues, ensure proper JSON formatting in the response.
- If WebSockets fail, restart both backend and frontend services.

## What's Next?
- **Enhanced AI Analysis** – More granular insights into environmental impact.
- **Expanded Data Sources** – Additional sustainability indicators for better accuracy.
- **Public API** – Allowing third-party apps to integrate sustainability scoring.
- **More Gamification** – Additional aura-based incentives and leaderboards.

## Contributors
- **Samridh** – Developer 
- **Ranjan** – AI Integration
- **Prannov** - AI Integration

## License
This project is licensed under the MIT License. See `LICENSE` for details.

---

Go Green or Cry – because sustainability should be the ultimate flex! 🌎✨


