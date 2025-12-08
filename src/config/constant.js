/**
 * configConstant.js
 * @description :: constants used in configuration
 */

import dotenv from "dotenv";
dotenv.config();

export const APP_NAME = process.env.APP_NAME || "App Name";
export const PORT = process.env.PORT || 4001;
export const IS_SECURE = process.env.IS_SECURE || false;
export const IS_PROXY = process.env.IS_PROXY|| false;

export const DB_CONNECTION = process.env.DB_CONNECTION || "mysql";
export const DB_HOST = process.env.DB_HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT || 3306;

export const MAIL_HOST = process.env.MAIL_HOST || "smtp.gmail.com";
export const MAIL_PORT = process.env.MAIL_PORT || 587;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_ENCRYPTION = process.env.MAIL_ENCRYPTION || "tls";

export const ENV = process.env.ENV || "development";
export const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME || 3 * 60 * 1000; // 3 minutes
export const STATIC_OTP_ENV = process.env.STATIC_OTP_ENV || ["local", "development"];
export const isSSLEnable = process.env.IS_SECURE || false;

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export const timeZoneMap = {
  'Asia/Calcutta': 'Asia/Kolkata', // Mapping for Kolkata
  'US/Eastern': 'America/New_York', // Mapping for New York
};

export const JWT = {
  SECRET: process.env.JWT_SECRET || "appname",
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1y",
};

export const baseUrl = (path = null) => {
  let url = '';
  if (IS_PROXY == "true") {
    url = `https://${process.env.HOST}`;
    return url + (path ? `/${path}` : "");
  }
  url = `http://${process.env.HOST}:${process.env.PORT}`;
  if (process.env.IS_SECURE == "true") {
    url = `https://${process.env.HOST}:${process.env.PORT}`;
  }
  return url + (path ? `/${path}` : "");
};

export const apiBaseUrl = (path = null) => {
  let url = '';
  if (IS_PROXY == "true") {
    url = `https://${process.env.HOST}/api/v1`;
    return url + (path ? `/${path}` : "");
  }
  url = `http://${process.env.HOST}:${process.env.PORT}/api/v1`;
  if (process.env.IS_SECURE == "true") {
    url = `https://${process.env.HOST}:${process.env.PORT}/api/v1`;
  }
  return url + (path ? `/${path}` : "");
};
