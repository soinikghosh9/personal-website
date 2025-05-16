# Personal Portfolio Website Template

This repository contains the code for a personal portfolio website. You can use this as a template to create and host your own portfolio online for free using GitHub Pages.

**Live Demo:** [https://soinikghosh9.github.io/personal-website/](https://soinikghosh9.github.io/personal-website/)


## Features

*   Responsive design (works on desktop, tablet, and mobile).
*   Sections for: About Me, Projects, Experience, Education, Publications, Conferences, Skills, Artistic Works, Awards, and Contact.
*   Clean and modern UI with a defined color palette.
*   Easy to customize content.
*   Integrated Font Awesome icons.
*   Working contact form using Formspree.

## How to Use This Template for Your Own Portfolio

Follow these steps to set up your own version of this portfolio website:

### 1. Prerequisites

*   **Git:** You'll need Git installed on your computer. Download it from [git-scm.com](https://git-scm.com/).
*   **GitHub Account:** You need a free GitHub account. Sign up at [github.com](https://github.com/).
*   **Text Editor:** A code editor like VS Code, Sublime Text, or Atom to edit the HTML and CSS files.
*   **Formspree Account (Optional, for Contact Form):** If you want the contact form to work, sign up for a free account at [formspree.io](https://formspree.io/).

### 2. Fork or Clone This Repository

**Option A: Forking (Recommended for contributing back or keeping a connection)**
    1. Go to this repository page on GitHub: [https://github.com/soinikghosh9/personal-website](https://github.com/soinikghosh9/personal-website)
    2. Click the "Fork" button in the top-right corner. This creates a copy of the repository under your own GitHub account.
    3. Clone your forked repository to your local machine:
       ```bash
       git clone https://github.com/YOUR_USERNAME/personal-website.git
       cd personal-website
       ```
       (Replace `YOUR_USERNAME` with your GitHub username)

**Option B: Cloning Directly (If you just want a copy to work on independently)**
    ```bash
    git clone https://github.com/soinikghosh9/personal-website.git
    cd personal-website
    ```

### 3. Customize the Content

Open the project folder in your text editor and modify the following files:

*   **`index.html`:**
    *   **`<title>` tag:** Change the website title in the `<head>` section.
    *   **Meta Tags:** Update `description` and `keywords` for SEO.
    *   **Header Section (`<header id="main-header">`):**
        *   Replace `images/your-photo.jpg` with the path to your profile picture. (Upload your photo to the `images` folder).
        *   Update your name, tagline, and sub-tagline.
    *   **Navigation Bar (`<nav id="navbar">`):** The links point to sections within the page. You generally won't need to change these unless you add/remove sections.
    *   **About Me Section (`<section id="about">`):** Update the text about yourself.
        *   Change the `href` for the "View Full CV (PDF)" link to point to your CV (e.g., place your CV in the `documents` folder and link to `documents/Your_CV_Name.pdf`).
    *   **Projects Section (`<section id="projects">`):** Update with your projects, their descriptions, and meta information.
    *   **Experience Section (`<section id="experience">`):** Update your work experience, workshops, etc.
    *   **Education Section (`<section id="education">`):** Update your educational background.
    *   **Publications Section (`<section id="publications">`):** List your publications with links.
    *   **Conferences Section (`<section id="conferences">`):** List your conference presentations.
    *   **Skills Section (`<section id="skills">`):** Update technical skills, core competencies, and research interests.
    *   **Artistic Works Section (`<section id="artistic-works">`):**
        *   Update descriptions.
        *   Change links to your music (Spotify, Gaana, YouTube, Instagram), filmmaking profiles (IMDb, YouTube), and photography/painting (Instagram).
    *   **Awards Section (`<section id="awards">`):** List your awards and recognitions.
    *   **Contact Section (`<section id="contact">`):**
        *   Update your contact details (location, phone, email addresses).
        *   Update social media links.
        *   **Formspree Integration:**
            *   Go to [formspree.io](https://formspree.io/), create a new form, and get your unique form endpoint URL (e.g., `https://formspree.io/f/YOUR_UNIQUE_ID`).
            *   In `index.html`, find the `<form>` tag within the contact section.
            *   Replace `action="https://formspree.io/f/myzwowdw"` with your own Formspree endpoint.
            *   Optionally, change the `value` of the hidden input `name="_subject"` to customize the subject of emails you receive.
    *   **Footer Section (`<footer id="main-footer">`):** Update the copyright year if needed.

*   **`css/style.css`:**
    *   **Color Palette:** Modify the CSS variables at the top (`:root`) to change the website's color scheme if desired.
    *   **Fonts:** You can change the `font-family` for `--font-primary` and `--font-headings` if you import different Google Fonts.
    *   Feel free to adjust any other styles to your liking.

*   **`images/` folder:**
    *   Replace `your-photo.jpg` with your profile picture (ensure the path in `index.html` matches).
    *   Replace `favicon.png` with your own 16x16 or 32x32 pixel favicon.
    *   (Optional) Add `screenshot.png` if you want to include a screenshot in this README.

*   **`documents/` folder:**
    *   Replace `Soinik_Ghosh_CV.pdf` with your own CV file and update the link in `index.html`.

*   **`js/main.js`:**
    *   Currently, this file likely handles things like setting the current year in the footer. You might add more JavaScript for interactivity if needed.

### 4. Test Locally

Open the `index.html` file in your web browser to see how your changes look locally.

### 5. Deploy to GitHub Pages

1.  **Set up Git (if you cloned, Git is already initialized):**
    If you didn't fork/clone and just downloaded the files, navigate to your project folder in the terminal and run:
    ```bash
    git init
    git config --global user.name "Your Name"
    git config --global user.email "you@example.com"
    ```
    (Replace with your GitHub name and email)

2.  **Add and Commit Your Changes:**
    ```bash
    git add .
    git commit -m "Customize portfolio with my information"
    ```

3.  **Create a New Repository on GitHub:**
    *   Go to [github.com](https://github.com/) and create a new public repository.
    *   **Important:**
        *   If you want your site at `https://YOUR_USERNAME.github.io/`, name the repository `YOUR_USERNAME.github.io`.
        *   Otherwise, you can name it anything (e.g., `my-portfolio`), and your site will be at `https://YOUR_USERNAME.github.io/my-portfolio/`.
    *   **Do not** initialize it with a README, .gitignore, or license if you already have these locally.

4.  **Link Your Local Repository to the Remote GitHub Repository:**
    GitHub will provide you with commands. It will look like:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPOSITORY_NAME.git
    git branch -M main
    git push -u origin main
    ```
    Execute these commands in your terminal.

5.  **Enable GitHub Pages:**
    *   In your new GitHub repository, go to "Settings" > "Pages".
    *   Under "Build and deployment":
        *   **Source:** Select "Deploy from a branch".
        *   **Branch:**
            *   Select `main`.
            *   Select `/ (root)` for the folder.
    *   Click "Save".

6.  **Wait for Deployment:**
    It might take a few minutes. GitHub Pages will show you the live URL once it's ready.

### 6. Activate Formspree (if using)
After deploying and the first time you submit a message through your contact form on the live site, Formspree will send a confirmation email to the address associated with your Formspree form. Click the confirmation link in that email to activate the form.

## Making Future Updates

1.  Make changes to your local files.
2.  Add, commit, and push the changes:
    ```bash
    git add .
    git commit -m "Describe your update"
    git push origin main
    ```
    GitHub Pages will automatically redeploy your site.

## Credits

*   Original structure and design by Soinik Ghosh.
*   Uses [Font Awesome](https://fontawesome.com/) for icons.
*   Uses [Google Fonts](https://fonts.google.com/).
*   Contact form powered by [Formspree](https://formspree.io/).

---

Good luck building your portfolio!
