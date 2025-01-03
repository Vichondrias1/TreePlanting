# CommuniTree Documentation

## Website Overview
**CommuniTree** is a website that enables users to calculate how many trees they can plant based on their contribution codes or QR codes. The platform utilizes a tree-planting points system where 50 points equate to one tree planted.

### Running the Website
To start the website, use Python's built-in HTTP server:
```bash
python -m http.server
```
This will host the website locally. Open your browser and navigate to `http://localhost:8000` to access the site.

## QR Code Structure
Each QR code should contain JSON data structured as follows:
```json
{
    "code": "QR123456",
    "amount": 800
}
```
- **`code`**: Unique identifier for the QR code.
- **`amount`**: Contribution amount in currency (e.g., PHP).

You can generate QR codes using [this online QR code generator](https://nuintun.github.io/qrcode/#/encode).

## Sample `sampleData.json`
The `sampleData.json` file contains predefined data for the website. This file should be located in the `data/` directory. Below is a sample structure of the JSON file:
```json
{
    "ABC123": { "amount": 1100 },
    "ABC333": { "amount": 1900 },
    "XYZ789": { "amount": 500 }
}
```
- **Key**: Unique code associated with a contribution.
- **`amount`**: Contribution amount in currency (e.g., PHP).

## Points System
1. **100 pesos** = 1 point.
2. **50 points** = 1 tree planted.

### Example
- **Contribution Amount**: 800 PHP
  - Points: `Math.floor(800 / 100) = 8`
  - Trees Planted: `Math.floor(8 / 50) = 0` (Points remain as 8 for future use).

- **Contribution Amount**: 5000 PHP
  - Points: `Math.floor(5000 / 100) = 50`
  - Trees Planted: `Math.floor(50 / 50) = 1`

Remaining points after the above contributions will be carried forward.

## User Workflow
1. **Login**: Users log in and their session is stored in `localStorage`.
2. **Enter Code**: Users input a code or upload a QR code.
3. **Validation**: The system checks whether the code or QR code is valid and unused.
4. **Points Calculation**: Points are calculated based on the contribution amount.
5. **Tree Conversion**: Points are converted to trees, updating the total trees planted and user-specific data.
6. **Leaderboard Update**: Leaderboard reflects the user's contribution.

## Leaderboard
The leaderboard displays the top contributors and their total trees planted.

### LocalStorage Keys Used
- **`loggedInUser`**: Stores the currently logged-in user.
- **`points_<username>`**: Tracks the user's points.
- **`trees_<username>`**: Tracks the user's total trees planted.
- **`usedCodes`**: Stores the list of used codes.

## Development Notes
- Ensure that `sampleData.json` is always up-to-date.
- Use a QR code scanner library like [jsQR](https://github.com/cozmo/jsQR) for decoding QR codes.
- Test QR codes thoroughly to validate structure and functionality.

## Sample QR Code Generation
To generate a sample QR code, use the [QR code generator](https://nuintun.github.io/qrcode/#/encode) and input the following JSON as the content:
```json
{
    "code": "QR123456",
    "amount": 800
}
```

## File Structure
```
project-directory/
├── data/
│   └── sampleData.json
├── index.html
├── scripts/
│   └── main.js
├── styles/
│   └── styles.css
└── README.md
```

## Future Enhancements
- Add user authentication and registration.
- Implement a backend for persistent data storage.
- Introduce analytics for tracking contributions over time.
