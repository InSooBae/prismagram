import { adjectives, nouns } from './word';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import jwt from 'jsonwebtoken';

export const generateSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

const sendMail = email => {
  const option = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };
  const client = nodemailer.createTransport(sgTransport(option));
  return client.sendMail(email);
};

export const sendSecretMail = (address, secret) => {
  const email = {
    from: '900301_2xxxx@naver.com',
    to: address,
    subject: '🔒Login Secret for Prismagram🔒',
    html: `Hello! Your login secret is <strong>${secret}</strong>.<br/>Copy paste on the app/website to login`
  };
  return sendMail(email);
};

export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET);
