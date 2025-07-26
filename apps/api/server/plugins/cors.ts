import cors from 'cors';
export default defineNitroPlugin(app => {
  app.h3App.use(
    fromNodeMiddleware(cors({ origin: '*', allowedHeaders: ['authorization', 'x-captcha-token'] }))
  )
});