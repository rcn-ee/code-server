import { Cookie } from "playwright"
import { checkForCookie, createCookieIfDoesntExist, normalize } from "../src/common/util"
import { Cookie as CookieEnum } from "../src/node/routes/login"
import { hash } from "../src/node/util"

describe("util", () => {
  describe("normalize", () => {
    it("should remove multiple slashes", () => {
      expect(normalize("//foo//bar//baz///mumble")).toBe("/foo/bar/baz/mumble")
    })

    it("should remove trailing slashes", () => {
      expect(normalize("qux///")).toBe("qux")
    })

    it("should preserve trailing slash if it exists", () => {
      expect(normalize("qux///", true)).toBe("qux/")
      expect(normalize("qux", true)).toBe("qux")
    })
  })

  describe("checkForCookie", () => {
    it("should check if the cookie exists and has a value", () => {
      const PASSWORD = "123supersecure!"
      const fakeCookies: Cookie[] = [
        {
          name: CookieEnum.Key,
          value: hash(PASSWORD),
          domain: "localhost",
          secure: false,
          sameSite: "Lax",
          httpOnly: false,
          expires: 18000,
          path: "/",
        },
      ]
      expect(checkForCookie(fakeCookies, CookieEnum.Key)).toBe(true)
    })
    it("should return false if there are no cookies", () => {
      const fakeCookies: Cookie[] = []
      expect(checkForCookie(fakeCookies, "key")).toBe(false)
    })
  })

  describe("createCookieIfDoesntExist", () => {
    it("should create a cookie if it doesn't exist", () => {
      const PASSWORD = "123supersecure"
      const cookies: Cookie[] = []
      const cookieToStore = {
        name: CookieEnum.Key,
        value: hash(PASSWORD),
        domain: "localhost",
        secure: false,
        sameSite: "Lax" as const,
        httpOnly: false,
        expires: 18000,
        path: "/",
      }
      expect(createCookieIfDoesntExist(cookies, cookieToStore)).toStrictEqual([cookieToStore])
    })
    it("should return the same cookies if the cookie already exists", () => {
      const PASSWORD = "123supersecure"
      const cookieToStore = {
        name: CookieEnum.Key,
        value: hash(PASSWORD),
        domain: "localhost",
        secure: false,
        sameSite: "Lax" as const,
        httpOnly: false,
        expires: 18000,
        path: "/",
      }
      const cookies: Cookie[] = [cookieToStore]
      expect(createCookieIfDoesntExist(cookies, cookieToStore)).toStrictEqual(cookies)
    })
  })
})
