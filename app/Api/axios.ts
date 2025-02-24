"use client";
import axios from "axios";
import Cookie from "cookie-universal";

const cookie = Cookie();

const token = cookie.get("aram_token");

export const main_api = "http://127.0.0.1:8000/api";

export const instance = axios.create({
  baseURL: main_api,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
