Hey Prof., this is my report for the project. 
Sorry for the delay, I had another project to propose first and it took more time than expected.

I put the cloned the project to a folder which name is "molview-local" in my XAMPP htdocs directory.
Then to be able to run the project, I started Apache server from XAMPP control panel and opened the URL "http://localhost/molview-local/molview/" in my web browser.
But before openning the URL, I disabled the Matomo Analytics script in the index.html file to avoid any external requests + I changed the name of the .htaccess from ".htaccess" to "htaccess.bak" so Apache wouldn’t rewrite/redirect during local testing.
Then I started Apache in XAMPP and opened the "C:\xampp\htdocs\molview-local\molview" and opened the cmd to run "npm install" and then "npx grunt".
Then put the URL and the project was running fine.

# Project Report
## Introduction
Recently, you asked me to allow the user to pick two atoms and compute & visualize the shortest path between them.
First I added the needed code for visualizing the button in the screen.
What I did to make it visual in my local server is:
I marked them as written lines with a comment "Shortest Path tool".
1. In index.html, This is the visible button, and the onclick calls the action that puts MolPad in the new tool mode.
2. In src/js/Actions.js, we added the action that the button calls when clicked.
3. In src/js/molpad/MPEvents.js, a new branch in the getHandler() function is being added. It defines exactly how the SHP tool behaves.
4. src/js/molpad/MPMolecule.js, A new method to compute the path: Actually find the path. I used a simple Breadth-First Search (BFS) on the bond graph (atoms are nodes, bonds are edges). It returns the list of atoms and bonds on the shortest route (fewest bonds), or null if they’re disconnected.


