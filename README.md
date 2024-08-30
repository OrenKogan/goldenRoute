Welcome to my submition for the Golden Route riddle, 

Running the app - 

	to run the app you simply run the next command on the base folder of the project - 
		docker compose up --build
    you then go into the browser and open up - 
        localhost:3000

Working with The Attack Predictor - 

    when opening the app you will see - 
		4 input fields for each vaiable needed to predict an attack
  			Latitude - Latitude of the missile
	 		Longitude - Longitude of the missile
			Speed - Speed of the missile in m/s
   			Radius - Radius of missile in km
	  	2 buttons - 
			Save Attack - saves to the database
   			Load Attack - opens a data table with saved attack
	  					  	you are able to hover over a specific row to see the data of the flight in danger
		   
	**to select a location for the missile you are also abale to simply click on the desired location on the map and set the speed and radius using the input fields**
	 
How to use the app to find the best path for the missile while avoiding a certain safe zone?  (backend BONUS 2)
	for this you will need to navigate using the url to  localhost:3000/safeZone

   **when opening this page you will see -**

	 	8 input fields -
   			top 4 - 
				Latitude - Latitude of the missile
		 		Longitude - Longitude of the missile
				Speed - Speed of the missile in m/s
	   			Radius - Radius of missile in km
	   		bottom 3 -
				Latitude - Latitude of the safe zone
		 		Longitude - Longitude of the safe zone
	   			Radius - Radius of safe zone in km


	  		
******** BONUSES ******

**BONUS 1**

 	we are serching for T
	our known parameters are =>
 		V - speed of friendly flight
   		U - speed of missile 
	 	fX, fY  - coordinates of freindly flight
   		mX, mY - coordinates of missile
	 	trueDiraction - the angle of the flight from the north/ angle from the y axis to flight path
   
	to find the time we will compare the equsions for the contact point of the missile and the flight 

	we will use the coordinates of the missile as (0, 0) for easier calculation. For this we will need to subtruct the missile coordinates from the flight coordinates for accurate result.
  	we will define Xp and Yp as the coordinates of the contact point

	alpha - the angle between the flight path and the x axis. 
 	alpha = 90 - trueDiraction
  
	using flight info
		Xp = fX + V * T * cos(alpha)
  		Yp = fY + V * T * sin(alpha)

 	using the missile info	
  		*reminder -  we are using coordinates of missile as 0,0 for easier calculation 
  		beta - angle between missile path and x axis
  		Xp = U * T * cos(beta)
		Yp = U * T * sin(beta)

  	from this we get - 
		fX + V * T * cos(alpha) = U * T * cos(beta)
  		fY + V * T * sin(alpha) = U * T * sin(beta)

 	we will raise both equstion to the power of 2 to get rid of beta angle in the next step
  		fX ** 2 + 2 * fX * V * T * cos(alpha) + V ** 2 * T ** 2 * cos(alpha) ** 2 = U ** 2 * T ** 2 * cos(beta) ** 2
		fY ** 2 + 2 * fY * V * T * sin(alpha) + V ** 2 * T ** 2 * sin(alpha) ** 2 = U ** 2 * T ** 2 * sin(beta) ** 2

  	now we will add both equstions to each other 
   		fX ** 2 + fY ** 2 + 2 * fX * V * T * cos(alpha) + 2 * fY * V * T * sin(alpha) + V ** 2 * T ** 2 * cos(alpha) ** 2  + V ** 2 * T ** 2 * sin(alpha) ** 2 =  U ** 2 * T ** 2 * cos(beta) ** 2 + U ** 2 * T ** 2 * sin(beta) ** 2

  	now lets simplify the equstions - 
   		fX ** 2 + fY ** 2 + 2 * V * T * (fX * cos(alpha) + fY * sin (alpha)) + V ** 2 * T ** 2 * (cos(alpha) ** 2 + sin(alpha) ** 2) = U ** 2 * T ** 2 * (cos(beta) ** 2 + sin(beta) ** 2)

   		*reminder => sin(angle) ** 2 + cos(angle) ** 2 = 1

  		therefor =>
		fX ** 2 + fY ** 2 + 2 * V * T * (fX * cos(alpha) + fY * sin (alpha)) + (V * T) ** 2 = (U * T ) ** 2

		now that we have a more simplified equestion we will tranform the equstion to a standart quadratic formula to solve for T => ax ** 2 + bx + c

  		**T** ** 2 * (V ** 2 - U ** 2) + 2 * V * (fX * cos(alpha) + fY * sin (alpha)) * **T** + fX ** 2 + fY ** 2 = 0

 		now we can just use the standard quadratic function to find T.
  		

 		

	
