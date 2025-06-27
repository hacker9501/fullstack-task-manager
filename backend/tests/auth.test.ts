import request from "supertest"
import app from "../src/server"
import { UserModel } from "../src/infrastructure/db/models/user-model"
import { hashPassword } from "../src/infrastructure/auth/password-service"

describe("Auth Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.name).toBe(userData.name)
    })

    it("should not register user with existing email", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      }

      // Create user first
      await request(app).post("/api/auth/register").send(userData)

      // Try to register again
      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const hashedPassword = await hashPassword("password123")
      await UserModel.create({
        email: "test@example.com",
        password: hashedPassword,
        name: "Test User",
      })
    })

    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.tokens.accessToken).toBeDefined()
      expect(response.body.data.user.email).toBe(loginData.email)
    })

    it("should not login with invalid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})
