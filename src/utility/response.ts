import { Response } from 'express';
const setHeaders = (res: Response) => {
  res.set({
    'Content-Type': 'application/json',
  });
};
export default {
  success: (res: Response, message: string, data: object) => {
    setHeaders(res);
    res.status(200).json({ error: false, message, data });
  },
  badRequest: (res: Response, message: string, data: object) => {
    setHeaders(res);
    res.status(400).json({ error: true, message, data });
  },
  notFound: (res: Response, message: string, data: object) => {
    setHeaders(res);
    res.status(404).json({ error: true, message, data });
  },
  internalServerError: (res: Response, message: string, data: object) => {
    setHeaders(res);
    res.status(500).json({ error: true, message, data });
  },
  unAuthorized: (res: Response, message: string, data: object) => {
    setHeaders(res);
    res.status(401).json({ error: true, message, data });
  },
};
