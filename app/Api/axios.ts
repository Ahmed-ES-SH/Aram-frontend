"use client";
import axios from "axios";
import Cookie from "cookie-universal";

const cookie = Cookie();

const token = cookie.get("aram_token");

export const main_api = "https://datafromapi-2.aram-gulf.com/api";

export const instance = axios.create({
  baseURL: "https://datafromapi-2.aram-gulf.com/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
