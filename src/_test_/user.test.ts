// import { registerHandler } from '../routes/auth' // Adjust the import path as per your project structure
// import UserService from '../service/user' // Assuming UserService is a module with findByEmail method
// import UserModel from '../models/User' // Assuming UserModel is imported from a module
// import bcrypt from 'bcryptjs'
// import httpStatus from 'http-status-codes'
// import Joi from 'joi'
// import { validateAndCheckPermission } from '../helper/validation'

// // Mocking dependencies
// jest.mock('../service/user', () => ({
//   findByEmail: jest.fn(),
// }))

// jest.mock('../models/User', () => ({
//   create: jest.fn(),
// }))

// jest.mock('bcryptjs', () => ({
//   hash: jest.fn(),
// }))

// // Mocking req, res, next objects
// const mockRequest = (body: any) => ({ body })
// const mockResponse = () => {
//   const res: any = {}
//   res.status = jest.fn().mockReturnValue(res)
//   res.json = jest.fn().mockReturnValue(res)
//   return res
// }
// const mockNext = jest.fn()

// describe('registerHandler', () => {
//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   it.skip('should register a new user successfully', async () => {
//     const req = mockRequest({
//       email: 'test@example.com',
//       password: '12345678Aa!',
//     })
//     const res = mockResponse()

//     // Mock behavior of findByEmail to return undefined (indicating no existing user)
//     // @ts-ignore
//     await UserService.findByEmail.mockResolvedValueOnce(undefined)

//     // Mock behavior of create and hash functions
//     const mockCreatedUser = { _id: '123', email: req.body.email }
//     // @ts-ignore
//     await UserModel.create.mockResolvedValueOnce(mockCreatedUser)
//     // @ts-ignore
//     await bcrypt.hash.mockResolvedValueOnce('hashedPassword123')

//     // Invoke the registerHandler function
//     await registerHandler(req as any, res as any, mockNext)

//     // Assertions
//     expect(UserService.findByEmail).toHaveBeenCalledWith(req.body.email)
//     expect(UserModel.create).toHaveBeenCalledWith({
//       email: req.body.email,
//       password: '12345678Aa!', // Ensure password is hashed correctly
//     })
//     expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED)
//     expect(res.json).toHaveBeenCalledWith({
//       msg: expect.stringContaining('Account created.'),
//       data: expect.objectContaining({
//         _id: expect.any(String),
//         email: req.body.email,
//       }),
//     })
//     expect(mockNext).not.toHaveBeenCalled() // Ensure next() is not called when successful
//   })

//   it('should handle existing user conflict', async () => {
//     const req = mockRequest({
//       email: 'test@example.com',
//       password: 'Password123',
//     })
//     const res = mockResponse()

//     // Mock behavior of findByEmail to return an existing user
//     // @ts-ignore
//     await UserService.findByEmail.mockResolvedValueOnce({
//       _id: '456',
//       email: req.body.email,
//     })

//     // @ts-ignore
//     await validateAndCheckPermission(req as any, mockNext, req, 'body')

//     // Invoke the registerHandler function
//     await registerHandler(req as any, res as any, mockNext)

//     // Assertions
//     expect(UserService.findByEmail).toHaveBeenCalledWith(req.body.email)
//     expect(res.status).toHaveBeenCalledWith(httpStatus.CONFLICT)
//     expect(res.json).toHaveBeenCalledWith({
//       msg: 'email already exist',
//     })
//     expect(UserModel.create).not.toHaveBeenCalled() // Ensure UserModel.create is not called
//     expect(mockNext).not.toHaveBeenCalled() // Ensure next() is not called when conflict
//   })

//   // Add more test cases for validation errors, etc.
// })
