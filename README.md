This is a short project for user CRUD and authentication using NestJs and passportjs.

It is about stateless authentication and the JWT is stored in an httpOnly cookie for extra security (from XSF attacks).
Also it uses sameSite property for protection against CSRF attacks and secure on production environment for man-in-the-middle attacks.

cors has been enabled for a react client application.
app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
});
