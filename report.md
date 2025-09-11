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

Explanation of the second push to github:
After pushing the first time, I started working on the functionality of the tool and not just the visual part.
So, I changed the code in both Actions.js and MPEvents.js and added a new method in MPMolecule.js.

1. Actions.js: Updated the action funciton to click-handler the SHP toolbar button calls, and inside it we have the toggle logic which says:
   if the button is already active, then deactivate it, else activate it and deactivate any other active tool.
2. MPEvents.js: The getHandler() function is updated to include the logic of the SHP tool.
   When the active tool is SHP, MolPad returns a handler with onPointerDown. On each click, we hit-test using MolPad’s picker and only proceed if an atom was clicked.
   • First click: store and highlight the first atom.
   • Second click: store the second atom, call mp.mol.computeShortestPath(a, b), and highlight all atoms/bonds on the path; we also save their indices in Sketcher.metadata.shortestPath2D.
   • While a path is highlighted and no pick is in progress: a single click on any atom clears the old highlight and uses that atom as the new first pick, enabling fast re-selection.
   Clicks on empty space/bonds do nothing; clicking the same atom twice is ignored. The SHP button toggle lives in Actions.mp_shortest_path.
3. MPMolecule.js: I cleaned up computeShortestPath so it’s easier to think about and hook to the UI. Instead of tracking two parallel maps (one for the previous atom and one for the previous bond), I keep a single “breadcrumb” per visited atom : prev[ni] = { ai, bond }.
   That way, when we reach the target, we just walk those breadcrumbs back to rebuild the path.
   I also changed the “no path / same atom” case to return null (not an empty object), so the SHP click handler can simply treat it as “nothing to highlight."
   Same simple ES5 BFS under the hood, just clearer names and a tidier shape that plays nicer with the selection/highlight flow.

I will add images in the "C:\xampp\htdocs\molview-local\Images\Shortest_Path" folder to show the steps of using the tool.
