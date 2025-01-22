import { clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server';

import { NextResponse } from 'next/server';



const isStudentRoute = createRouteMatcher(['/student(.*)']);
const isManagerRoute = createRouteMatcher(['/manager(.*)']);
const isClientRoute = createRouteMatcher(['/client(.*)']);
const isAuthNeededRoute = createRouteMatcher(['/']);
const isPublicRoute = createRouteMatcher(['/login(.*)','/aluno/project(.*)','/communit(.*)']);


export default clerkMiddleware(async (auth, req) => {
  const users: { [key: string]: string } = {
    user_2pSGJdnAZUTHYXG6UKBCoKGmfJn: 'student',
    user_2pSGHwzXdu9ZrqVRlSkNUwxZBQ2: 'client',
    user_2pSGGLFlxBWJHeENiqRTZ6WNs2G: 'manager',
  };


  
  const userCookie = req.cookies.get('user');

  
  

  if (isPublicRoute(req)){
    console.log("PUBLIC ROUTE");
    return NextResponse.next();
  }

  else if (isAuthNeededRoute(req)){
    console.log("AUTH REQUIRED ROUTE");
    console.log("VERIFY IF USER IS JUST SIGNED IN WITHOUT ROLE DISTINCTION")
    // const isSignedIn = false;
    
    // if (isSignedIn){
    //   return NextResponse.next();
    // }

    // else{
    //   return NextResponse.redirect(new URL('/login', req.url))
    // }
    return NextResponse.next();


    
  }

  

  else{
    console.log("AUTH AND SPECIFIC ROLE REQUIRED ROUTES")

    if (userCookie){
      console.log("USER ID COOKIE EXISTS");
      const userId = userCookie.value;
      const userRole = users[userId];
      
      if (isStudentRoute(req)) {
        console.log("VERIFY IF USER ID COOKIE IS OF A STUDENT")
        if (userRole == "student"){
          
          // console.log(`User cookie: ${userId}\n\nUser role: ${userRole}`);
          return NextResponse.next();
  
        } 
        else {
          // return NextResponse.redirect(new URL('/', req.url))
        }
      } 
      
      else if (isManagerRoute(req)){
        console.log("VERIFY IF USER ID COOKIE IS OF A MANAGER")
        if (userRole == "manager"){
          console.log(`User cookie: ${userId}\n\nUser role: ${userRole}`);
          return NextResponse.next();
          
        } 
        else {
          return NextResponse.redirect(new URL('/', req.url))
        }
  
      } 
  
      else if (isClientRoute(req)){
        console.log("VERIFY IF USER ID COOKIE IS OF A CLIENT")
  
        if (userRole == "client"){
          console.log(`User cookie: ${userId}\n\nUser role: ${userRole}`);
          return NextResponse.next();
          
        } 
        else {
          return NextResponse.redirect(new URL('/', req.url))
        }
         
      }
  
      
      
    }
  
    else {
      console.log("USER ID COOKIE DO NOT EXISTS");
      
      
      // return NextResponse.redirect(new URL('/login', req.url))
      
    }

  } 


  

  
  
});

export const config = {
  matcher: [
    '/api/:path*', // Aplica o middleware em todas as rotas da API
    '/((?!_next|favicon.ico).*)',
  ],
};