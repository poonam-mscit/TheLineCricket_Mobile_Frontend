# Pages Feature - Quick Start Guide

## 🚀 Getting Started

The Academy, Community, and Venue pages feature is now fully integrated into your app! Here's how to use it:

## 📱 How to Test

### 1. Start the App
```bash
cd TheLineCricket_Mobile_Frontend
npx expo start
```

### 2. Navigate to Profile
- Run the app on your device/simulator
- Go to the Profile screen
- You'll see your name in the header with a burger menu icon (☰)

### 3. Access Page Management
- Click the burger menu icon (☰) in the top-right
- You'll see the dropdown menu with:
  - ⚙️ Settings
  - **➕ Create Page** (always visible)
  - ℹ️ About
  - 🚪 Logout

### 4. Create Your First Page

#### Option A: Create an Academy
1. Click "+ Create Page"
2. Click "Create" on the Academy card (purple, 🏫)
3. Fill in:
   - Academy Name (required)
   - Type (e.g., "Cricket Academy")
   - Description (required)
   - Contact information
4. Click "Create Academy"
5. You'll be redirected to Profile
6. Open the menu again - your academy now appears!

#### Option B: Create a Community
1. Click "+ Create Page"
2. Click "Create" on the Community card (blue, 👥)
3. Fill in:
   - Community Name (required)
   - Description (required)
   - Email
4. Click "Create Community"

#### Option C: Create a Venue
1. Click "+ Create Page"
2. Click "Create" on the Venue card (green, 🏟️)
3. Fill in:
   - Venue Name (required)
   - Description (required)
   - Email
4. Click "Create Venue"

### 5. View Your Page
1. Open the Profile menu (☰)
2. Under "Manage Pages" you'll see your page(s)
3. Each page shows:
   - Icon (🏫 for Academy, 👥 for Community, 🏟️ for Venue)
   - Page name
   - Type badge
4. Click on any page to view details

### 6. Edit Your Page
1. View the page (step 5)
2. Click "Edit" button in the header
3. Make changes to any field
4. Click "Save" to keep changes
5. Or click "Cancel" to discard

## 🎨 Visual Reference

### Profile Dropdown Menu
```
┌──────────────────────────────┐
│ ⚙️ Settings                   │
├──────────────────────────────┤
│ MANAGE PAGES                 │
│ 🏫 Mumbai Academy [Academy]  │
│ 👥 Cricket Lovers [Community]│
│ ➕ Create Page                │
├──────────────────────────────┤
│ ℹ️ About                      │
│ 🚪 Logout                     │
└──────────────────────────────┘
```

### Page Type Selector
```
┌─────────────────────────────┐
│ Create a Page           [×] │
│                             │
│ ┌───────────────────────┐   │
│ │ 🏫 Academy            │   │
│ │ Create a cricket academy│ │
│ │ [Create]              │   │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ 👥 Community          │   │
│ │ Build a community     │   │
│ │ [Create]              │   │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ 🏟️ Venue              │   │
│ │ List your venue       │   │
│ │ [Create]              │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

## 🔍 Features to Try

### Academy Page
- ✅ View purple gradient cover
- ✅ Add facilities (click "+ Add" in edit mode)
- ✅ View coaches grid
- ✅ See programs with enrollment status
- ✅ Click contact information (phone, email, website)
- ✅ Use action buttons (Contact, Follow, Share)

### Community Page
- ✅ View blue gradient cover
- ✅ See member count
- ✅ Edit description and stats
- ✅ Join community button
- ✅ Share community

### Venue Page
- ✅ View green gradient cover
- ✅ See capacity information
- ✅ Edit venue details
- ✅ Book venue button
- ✅ Share venue

## 📊 Test Scenarios

### Create Multiple Pages
1. Create an Academy called "Elite Cricket Academy"
2. Create a Community called "Cricket Enthusiasts"
3. Create a Venue called "Central Cricket Ground"
4. All three should appear in your dropdown menu

### Edit and Save
1. Open any page
2. Click "Edit"
3. Change the description
4. Click "Save"
5. Refresh by pulling down
6. Changes should persist

### Navigation
1. Profile → Click page → View details
2. Click back button → Return to Profile
3. Open menu → Page still listed
4. Click different page → Navigate to that page

## 🐛 Troubleshooting

### Page doesn't appear in dropdown
- Make sure you clicked "Create" button
- Check you filled required fields (name, description)
- Pull to refresh on Profile screen

### Can't edit page
- Make sure you clicked "Edit" button in header
- Check you're viewing your own page
- Try refreshing the page

### Changes not saved
- Make sure you clicked "Save" not "Cancel"
- Check AsyncStorage has write permissions
- Try creating a new page

## 💡 Tips

1. **Required Fields**: Only Name and Description are required
2. **Multiple Pages**: You can create unlimited pages of each type
3. **Edit Anytime**: Click Edit button to modify any information
4. **Delete Facilities**: In edit mode, click X button on facilities
5. **Contact Actions**: Click contact info to call/email/visit website
6. **Pull to Refresh**: Pull down on any screen to reload data

## 📝 Sample Data

### Sample Academy
```
Name: Mumbai Cricket Academy
Type: Professional Cricket Training
Description: Premier cricket coaching academy with state-of-the-art facilities and experienced coaches. Specialized in developing young talent.
Phone: +91 9876543210
Email: info@mumbaiCA.com
Website: https://mumbaiCA.com
```

### Sample Community
```
Name: Cricket Enthusiasts Mumbai
Description: A community for cricket lovers in Mumbai to connect, share experiences, and organize friendly matches.
Email: community@cricketmumbai.com
```

### Sample Venue
```
Name: Wankhede Practice Ground
Description: Professional cricket ground available for practice sessions, coaching camps, and friendly matches. Full facilities included.
Email: bookings@wankhede-practice.com
```

## ✅ Success Checklist

- [ ] Can open Profile menu
- [ ] Can see "+ Create Page" option
- [ ] Can open Page Type Selector
- [ ] Can create an Academy
- [ ] Can create a Community
- [ ] Can create a Venue
- [ ] Pages appear in dropdown menu
- [ ] Can navigate to page details
- [ ] Can edit page information
- [ ] Changes persist after save
- [ ] Can return to Profile
- [ ] Multiple pages show correctly

## 🎯 Next Steps

After testing the basic functionality:
1. Try creating pages with more detailed information
2. Test editing facilities on Academy pages
3. Explore the contact information features
4. Test the action buttons (Contact, Follow, Share, Book)
5. Create multiple pages and switch between them

## 📞 Support

If you encounter any issues:
1. Check console logs for errors
2. Verify AsyncStorage permissions
3. Restart the app
4. Clear app data and try again

Enjoy your new page management system! 🎉

