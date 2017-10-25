Created by: Eric Lewantowicz
File: README.txt
Date: 4/15/2017
Course: CSE 5542 RT Rendering
Project: Lab 5: Texture Mapping and Environment Mapping
Developed On: Google Chrome using Windows 10
Instructions: 	
  Option 1: use weblink for hosted static website, using Chrome browser if able:
	1. http://porkchopsandwiches.club
  Option 2: open project file locally:
	1. Unzip the project5.zip project file into a directory 
	2. Open project.html or project_imgur.html in Chrome browser
***************************************************************************************************************************
 *** Textures and model object files are stored on AWS S3 web servers.  Please let me know if there are any
	 problems accessing them when executing the program. ***
***************************************************************************************************************************

The primary method to open the scene is using the static website located at http://porkchopsandwiches.club or http://www.porkchopsandwiches.club.  Due to the size of the texture images and sound files used in the scene, it may take 30 seconds or more to load depending on bandwidth.  If there are any issues with the website links, you can open the project locally with the project.html or project_imgur.html files.

For Lab 5 I continued to build on the urban scene from lab 3 and lab 4.  I used six different textures on the exterior building walls, a brick texture on the four walls along the roads, and five textures in the surrounding landscape environment -- grass, sky, mountains, beach, desert (and a sixth wind turbine scene for the cubemap environment texture, but left out of the world to be able zoom out and view the entire scene).  For the brick wall, building, and grass textures, I repeated the texture pattern, and for the landscape textures, I stretched them to the dimensions of the landscape square objects.

*** Note:  I intentionally omitted one of the six cube environment walls in order to be able to zoom out farther from one side and view the entire scene with the sunrise/sunset animation.

I also imported three unique .OBJ polygonal model objects and used a simple loader/parser to extract the necessary vertex position, normal, texture, and index values, and then created the VBOs for each object.  I also loaded a cubemap with the same six images used in the surrounding environnment textures and implemented environmental texture mapping on the three polygonal models.  I ended up using .OBJ models, because I had a hard time finding any basic .JSON format models with the vertex position, texture, and normal data that I needed.  JS3 seems to be common, but I didn't want to rely on an entire framework to implement the model features, so the .OBJ option worked well, even though there was a learning curve to integrate it into the project.

Since I had already added windows to the buildings, I thought it would be interesting to experiment with environment cubemapping on those as well to simulate glass reflections, and it seemed to work out pretty well.

I also added color tinting to the environmental mapping to the two statue objects to experiment with some different material reflection effects.

I also added some color dimming/intensifying to the cubemapped surfaces during the sunrise/sunset "Day Simulation" cycle that you can view using the html button.

The Viper ship model object will fly across the sky as the scene is redrawn

I also added a tank gun fire animation, similar to the 2D effect I had in lab 2.

-------------------------------------------------------------------------------------
CONTROLS:

Tank gun fire: keyboard 'Z' key
Lighting Controls: see html page table of controls below the canvas for keyboard and html button commands
Tank Controls: see html page for list of controls
Camera Controls: see html page for list of controls
*** You can use the 1st person tank camera to travel the scene and observe cubemap reflections, as well as the "Day Simulation" animations. ***

--------------------------------------------------------------------------------------
FEATURES:

New additions:
- www.porkchopsandwiches.club: I hosted the scene and uploaded all assets to AWS S3 webservers, so no files are needed locally.
- Brick texture on the four walls lining the road, repeating pattern.
- Six different textures for exterior building walls, repeating patterns.
- Grass texture on the ground, repeating pattern.
- Environment landscape textures--mountains, desert, beach, and sky--stretched to fit the square objects1.
- Viper ship polygonal model with environment cube mapping.  The ship travels across the sky as the scene is redrawn.
- Statue of liberty polygonal model with environment cube mapping, and tinted green to better represent the statue appearance.
- Warrior statue polygonal model with environment cube mapping, and tinted blue to modify the statue appearance.
- Added environment cube mapping to the building windows to create a window reflection effect.
- Added color varying effects to objects and environment with the sunrise/sunset simulation to achieve dimming and
  brightening of objects and reflections during the day cycle.
- Viewing the "Day Simulation" in 1st Person Camera gives some interesting visual effects when facing the beach for the 
  sunrise, and facing the green mountains for the sunset.
- Light dimming effects to the cubemapped and other object surfaces during the "Day Simulation".
- Tank gun firing effect that grows and shrinks as the scene is redrawn.
- Reintroduced sound effects for tank and turret movement and gun firing.


Features previously implemented in Lab 3 and Lab 4:
- A visual "sun" spherical object reference to track the position of the light source as it is moved in the sky.
- Keyboard controls to move the light source forward, backward, left, right, up, and down in the world space.
- Keyboard controls to change the intensity of the light source.
- A Day Simulation that generates an automated sunrise to sunset scene, demonstrating lighting motion, color, and intensity effects.
- Day Simulation can be run either from 1st Person Vehicle Camera or from the 3rd person world camera.
- Modify the background color to match the current light intensity.
- Shapes used:
	-- SPHERE:   Trees, Lamps, Tank turret
	-- CYLINDER: Lamp poles, Tree trunks, tank barrel
	-- CUBE:	 Tank body, Tank tracks, Roads, Road stripes, Buildings, Windows, Walls, Wall caps
- Move the center of interest (COI) up/down and left/right in the scene using keyboard control.
- Move the camera closer/farther from the scene, as well as rotate it around the X/Y/Z axes using the keyboard and HTML buttons.
- Move the tank around the scene using keyboard controls.  The turret can also be rotated using the keyboard.
- Can toggle between a moveable scene camera and a 1st-person vehicle camera using the HTML button.
- Added randomized coloring effects to the sphere and cylinder VCBs to give a textured appearance to the trees, tree trunks, lamps, and tank turret.
- Background music as you explore the city. Can mute background music.
- Can reset the scene using HTML button.
- Dynamically adjust canvas and viewport to a square box dependent on the smaller of the browser's width or height.  Canvas size should adjust automatically when browser is resized.
- You can have multiple key inputs at the same time, so that you can turn and move forward, or move and rotate the turret simultaneously, but the input system is still a little wonky, so you may have to release and press an input key if you have multiple simultaneous key actions and your movement stops unexpectedly. To do this, I added keypresses to a Map that are stored with an activated boolean flag until a keyup is detected for the keycode, at which point the boolean flag is set to false for the key.

Note: Background music from audionautix.com

Dependent Files:
1. project.html
2. project.css
3. project.js
4. shaders_setup.js
5. jquery-3.1.1.js
6. boostrap.min.js for button effects
7. howler.min.js for sound file control
8. glMatrix-0.9.5.min_1.js for matrix operations
9. sound effect file
10. webgl-obj-loader for loading and parsig .obj polygonal model files
