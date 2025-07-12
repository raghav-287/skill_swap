# SkillSwap Platform

## 💡 Overview
**SkillSwap** is a modern web application built to connect individuals who want to exchange skills. Whether you're a photographer looking to learn guitar or a coder who wants to master cooking, SkillSwap helps you find people with complementary skills and creates a platform for mutual learning.

---

## 👥 Team Synergy

- **Udit Garg**  
  Email: [udit_2401mc07@iitp.ac.in]
- **Raghav Singla**
  Email: [raghav_2401mc32@iitp.ac.in]
- **Raghav Bansal**
  Email: [raghav_2401me51@iitp.ac.in]
- **Mayank Shrivastava**
  Email: [mayank_2401mc16@iitp.ac.in]

---
## Features

### 🔐 User Authentication
- **User Signup**: Create an account with username, password, name, email, location (optional), and profile picture (optional)
- **User Login**: Secure login with username and password
- **Session Management**: Persistent login sessions using localStorage

### 🎯 Skill Management
- **Add Skills Offered**: List skills you can teach others
- **Add Skills Wanted**: List skills you want to learn
- **Skill Details**: Include skill name, description, and proficiency level (Beginner, Intermediate, Advanced, Expert)
- **Remove Skills**: Delete skills from your profile

### 👥 Friend System
- **Find Friends**: Search for other users by username or name
- **Add Friends**: Send friend requests to other users
- **Remove Friends**: Remove friends from your network
- **Friend List**: View all your connections

### 🔒 Profile Privacy
- **Public/Private Toggle**: Make your profile visible or hidden to other users
- **Privacy Control**: Control who can see your skills and information

### 🤝 Skill Matching
- **Automatic Matching**: Find users who can teach skills you want to learn
- **Match Display**: View potential skill exchange opportunities
- **Quick Actions**: Add friends directly from match suggestions

### 🕒 Availability Management
- **Set Availability**: Choose when you're available for skill exchanges
- **Multiple Options**: Weekends, Evenings, Weekdays, or Flexible Schedule
- **Additional Notes**: Add specific preferences or constraints
- **Availability Display**: Show your availability to potential skill partners

### 🔍 Skill Browsing & Search
- **Browse All Skills**: View all available skills from public users
- **Advanced Search**: Search for specific skills (e.g., "Photoshop", "Excel", "Cooking")
- **Filter Options**: Filter by availability and skill level
- **User Profiles**: View user details, skills, and availability

### 📋 Swap Request System
- **Request Swaps**: Send skill exchange requests to other users
- **Accept/Reject**: Accept or reject incoming swap requests
- **Pending Requests**: View and manage pending swap requests
- **Accepted Swaps**: Track your active skill exchanges
- **Sent Requests**: Monitor your outgoing requests
- **Delete Requests**: Remove pending requests that haven't been accepted
- **Swap Details**: Include messages and preferred meeting times

### 📱 Responsive Design
- **Mobile-Friendly**: Works perfectly on all device sizes
- **Modern UI**: Beautiful gradient design with smooth animations
- **Intuitive Navigation**: Easy-to-use interface with clear sections

## File Structure

```
skill-swap/
├── index.html          # Main HTML file with all UI components
├── styles.css          # Complete CSS styling with responsive design
├── script.js           # JavaScript functionality and data management
└── README.md           # This documentation file
```

## Setup Instructions

1. **Download Files**: Save all three files (`index.html`, `styles.css`, `script.js`) in the same folder
2. **Open in Browser**: Double-click `index.html` or open it in your web browser
3. **Start Using**: The application will load immediately - no server setup required!

## How to Use

### Getting Started
1. **Create Account**: Click "Sign Up" and fill in your details
2. **Add Profile Picture** (Optional): Upload an image during signup
3. **Set Location** (Optional): Add your location to help others find you
4. **Set Availability**: Click "Edit Availability" to set when you're available for skill exchanges

### Managing Skills
1. **Add Skills You Offer**:
   - Click "Add Skill" in the "Skills I Offer" section
   - Enter skill name, description, and select your level
   - Click "Add Skill" to save

2. **Add Skills You Want**:
   - Click "Add Skill" in the "Skills I Want" section
   - Enter the skill you want to learn
   - Select your current level (if any)

3. **Remove Skills**:
   - Click the trash icon next to any skill to remove it

### Browsing and Searching Skills
1. **Browse Skills**: Click "Browse Skills" in the navigation
2. **Search for Skills**: Use the search bar to find specific skills
3. **Filter Results**: Use availability and level filters to narrow results
4. **View User Profiles**: Click on skill cards to see user details
5. **Request Swaps**: Click "Request Swap" to initiate a skill exchange

### Managing Availability
1. **Set Your Schedule**: Click "Edit Availability" in your dashboard
2. **Choose Times**: Select when you're available (weekends, evenings, weekdays, flexible)
3. **Add Notes**: Include any specific preferences or constraints
4. **Save Settings**: Your availability will be visible to other users

### Swap Request System
1. **Send Requests**:
   - Browse skills and click "Request Swap"
   - Write a message explaining what you want to learn
   - Select a skill you can offer in exchange
   - Choose your preferred meeting time
   - Send the request

2. **Manage Incoming Requests**:
   - Go to "My Swaps" → "Pending Requests"
   - Review the request details
   - Accept or reject the swap offer

3. **Track Your Requests**:
   - "Pending Requests": Requests you've received
   - "Accepted Swaps": Active skill exchanges
   - "Sent Requests": Requests you've sent to others

4. **Delete Requests**:
   - In "Sent Requests", delete any pending requests
   - Only pending requests can be deleted

### Finding Friends
1. **Search for Users**: Click "Find Friends" and search by username or name
2. **Add Friends**: Click "Add Friend" next to any user
3. **View Friends**: See all your connections in the "My Friends" section
4. **Remove Friends**: Click the user-minus icon to remove a friend

### Privacy Settings
- **Toggle Profile Privacy**: Use the switch in the dashboard header
- **Public Profile**: Other users can see your skills and add you as a friend
- **Private Profile**: Only your friends can see your information

### Skill Matching
- **View Matches**: Check the "Skill Matches" section for potential exchanges
- **Connect**: Add friends directly from match suggestions
- **Exchange Skills**: Contact your matches to arrange skill exchanges

## Technical Details

### Data Storage
- **LocalStorage**: All data is stored locally in the browser
- **No Server Required**: Works completely offline
- **Data Persistence**: Your data remains between browser sessions

### Security Features
- **Session Management**: Secure login sessions
- **Data Validation**: Input validation for all forms
- **Privacy Controls**: User-controlled profile visibility

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **JavaScript Required**: Must have JavaScript enabled
- **LocalStorage Support**: Requires localStorage capability

## Sample Data

The platform comes with no pre-loaded data. Users create their own:
- **User Accounts**: Stored with username, password, name, email, location, profile picture
- **Skills**: Organized by offered vs wanted, with descriptions and levels
- **Friendships**: Bidirectional friend connections
- **Sessions**: Active login sessions
- **Availability**: User availability settings and preferences
- **Swap Requests**: Complete swap request management system

## Customization

### Styling
- **Colors**: Modify the CSS variables in `styles.css`
- **Layout**: Adjust grid layouts and spacing
- **Animations**: Customize transitions and effects

### Functionality
- **Add Features**: Extend the JavaScript class with new methods
- **Data Structure**: Modify the data storage format
- **Validation**: Add custom validation rules

## Troubleshooting

### Common Issues
1. **Data Not Saving**: Ensure localStorage is enabled in your browser
2. **Images Not Loading**: Check that the image file is valid
3. **Login Issues**: Clear browser data and try again
4. **Swap Requests Not Working**: Make sure you have skills offered before requesting swaps

### Browser Support
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Internet Explorer**: Not supported

## Future Enhancements

Potential features for future versions:
- **Real-time Messaging**: Chat with friends and skill matches
- **Skill Categories**: Organize skills by categories
- **Rating System**: Rate skill exchanges and teachers
- **Calendar Integration**: Schedule skill exchange sessions
- **Video Calls**: Built-in video calling for remote skill sharing
- **Skill Verification**: Certificates or endorsements for skills
- **Group Sessions**: Multiple people learning together
- **Location-based Matching**: Find nearby skill partners
- **Skill Progress Tracking**: Track learning progress over time
- **Notifications**: Email or push notifications for swap requests

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the browser compatibility requirements
3. Ensure all files are in the same directory
4. Try clearing browser cache and data

---

**Happy Skill Swapping!** 🎓✨ 
