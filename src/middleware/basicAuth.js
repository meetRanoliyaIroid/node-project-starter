import { WEB_PAGE_USERNAME, WEB_PAGE_PASSWORD } from "../config/constant";

export default function basicAuth(req, res, next) {
  // Simple hardcoded username and password from env
  const USERNAME = WEB_PAGE_USERNAME;
  const PASSWORD = WEB_PAGE_PASSWORD;

  // Get username and password from request header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.status(401).render('error', { 
        message: 'Authentication required. Please login to continue.',
        title: 'Authentication Error'
    });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  if (username == USERNAME && password == PASSWORD) {
    next(); // Authentication success
  } else {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.status(401).render('error', { 
        message: 'Invalid credentials. Please try again.',
        title: 'Authentication Error'
    });
  }
}
