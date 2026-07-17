

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/app/utils/catchAsync.ts
var catchAsync, catchAsync_default;
var init_catchAsync = __esm({
  "src/app/utils/catchAsync.ts"() {
    "use strict";
    catchAsync = (fn) => (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
    catchAsync_default = catchAsync;
  }
});

// src/app/utils/sendResponse.ts
var sendResponse, sendResponse_default;
var init_sendResponse = __esm({
  "src/app/utils/sendResponse.ts"() {
    "use strict";
    sendResponse = (res, statusCode, payload) => {
      res.status(statusCode).json(payload);
    };
    sendResponse_default = sendResponse;
  }
});

// src/app/config/index.ts
import dotenv from "dotenv";
import path from "path";
var config_default;
var init_config = __esm({
  "src/app/config/index.ts"() {
    "use strict";
    dotenv.config({ path: path.join(process.cwd(), ".env") });
    config_default = {
      port: process.env.PORT || 5e3,
      database_url: process.env.DATABASE_URL,
      jwt_secret: process.env.JWT_SECRET,
      jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
      bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
      stripe_secret_key: process.env.STRIPE_SECRET_KEY,
      client_url: process.env.CLIENT_URL,
      stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
    };
  }
});

// src/app/config/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma, prisma_default;
var init_prisma = __esm({
  "src/app/config/prisma.ts"() {
    "use strict";
    prisma = new PrismaClient();
    prisma_default = prisma;
  }
});

// src/app/errors/AppError.ts
var AppError, AppError_default;
var init_AppError = __esm({
  "src/app/errors/AppError.ts"() {
    "use strict";
    AppError = class extends Error {
      statusCode;
      constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
      }
    };
    AppError_default = AppError;
  }
});

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var generateToken, verifyToken;
var init_jwt = __esm({
  "src/app/utils/jwt.ts"() {
    "use strict";
    init_config();
    generateToken = (payload, expiresIn) => {
      return jwt.sign(payload, config_default.jwt_secret, {
        expiresIn: expiresIn || config_default.jwt_expires_in
      });
    };
    verifyToken = (token) => {
      return jwt.verify(
        token,
        config_default.jwt_secret
      );
    };
  }
});

// src/app/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
var registerUser, loginUser, getMe, AuthService;
var init_auth_service = __esm({
  "src/app/modules/auth/auth.service.ts"() {
    "use strict";
    init_config();
    init_prisma();
    init_AppError();
    init_jwt();
    registerUser = async (payload) => {
      const existingUser = await prisma_default.user.findUnique({
        where: {
          email: payload.email
        }
      });
      if (existingUser) {
        throw new AppError_default(
          409,
          "User already exists"
        );
      }
      const hashedPassword = await bcrypt.hash(
        payload.password,
        config_default.bcrypt_salt_rounds
      );
      const user = await prisma_default.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          password: hashedPassword,
          phone: payload.phone,
          avatar: payload.avatar,
          role: payload.role
        }
      });
      return user;
    };
    loginUser = async (payload) => {
      const user = await prisma_default.user.findUnique({
        where: {
          email: payload.email
        }
      });
      if (!user) {
        throw new AppError_default(
          httpStatus.UNAUTHORIZED,
          "Invalid email or password"
        );
      }
      const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password
      );
      if (!isPasswordMatched) {
        throw new AppError_default(
          httpStatus.UNAUTHORIZED,
          "Invalid email or password"
        );
      }
      const accessToken = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });
      const { password, ...userWithoutPassword } = user;
      return {
        accessToken,
        user: userWithoutPassword
      };
    };
    getMe = async (userId) => {
      const user = await prisma_default.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return user;
    };
    AuthService = {
      registerUser,
      loginUser,
      getMe
    };
  }
});

// src/app/modules/auth/auth.controller.ts
import { StatusCodes } from "http-status-codes";
var registerUser2, loginUser2, getMe2, AuthController;
var init_auth_controller = __esm({
  "src/app/modules/auth/auth.controller.ts"() {
    "use strict";
    init_catchAsync();
    init_sendResponse();
    init_auth_service();
    registerUser2 = catchAsync_default(async (req, res) => {
      const result = await AuthService.registerUser(req.body);
      sendResponse_default(res, StatusCodes.CREATED, {
        success: true,
        message: "User registered successfully",
        data: result
      });
    });
    loginUser2 = catchAsync_default(async (req, res) => {
      const result = await AuthService.loginUser(req.body);
      sendResponse_default(res, 200, {
        success: true,
        message: "Login successful",
        data: result
      });
    });
    getMe2 = catchAsync_default(async (req, res) => {
      const result = await AuthService.getMe(req.user.userId);
      sendResponse_default(res, StatusCodes.OK, {
        success: true,
        message: "Profile retrieved successfully",
        data: result
      });
    });
    AuthController = {
      registerUser: registerUser2,
      loginUser: loginUser2,
      getMe: getMe2
    };
  }
});

// src/app/middlewares/validateRequest.ts
var validateRequest, validateRequest_default;
var init_validateRequest = __esm({
  "src/app/middlewares/validateRequest.ts"() {
    "use strict";
    validateRequest = (schema) => (req, res, next) => {
      const result = schema.safeParse({
        body: req.body
      });
      if (!result.success) {
        return next(result.error);
      }
      req.body = result.data.body;
      next();
    };
    validateRequest_default = validateRequest;
  }
});

// src/app/modules/auth/auth.validation.ts
import { z } from "zod";
var registerSchema, loginSchema;
var init_auth_validation = __esm({
  "src/app/modules/auth/auth.validation.ts"() {
    "use strict";
    registerSchema = z.object({
      body: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        phone: z.string().optional(),
        avatar: z.string().optional(),
        role: z.enum(["CUSTOMER", "PROVIDER"])
      })
    });
    loginSchema = z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6)
      })
    });
  }
});

// src/app/middlewares/auth.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";
var auth, auth_default;
var init_auth = __esm({
  "src/app/middlewares/auth.ts"() {
    "use strict";
    init_AppError();
    init_jwt();
    auth = (req, _res, next) => {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return next(
          new AppError_default(
            StatusCodes2.UNAUTHORIZED,
            "You are not authorized."
          )
        );
      }
      const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
      try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
      } catch {
        next(
          new AppError_default(
            StatusCodes2.UNAUTHORIZED,
            "Invalid or expired token."
          )
        );
      }
    };
    auth_default = auth;
  }
});

// src/app/modules/auth/auth.route.ts
import { Router } from "express";
var router, auth_route_default;
var init_auth_route = __esm({
  "src/app/modules/auth/auth.route.ts"() {
    "use strict";
    init_auth_controller();
    init_validateRequest();
    init_auth_validation();
    init_auth();
    router = Router();
    router.post(
      "/register",
      validateRequest_default(registerSchema),
      AuthController.registerUser
    );
    router.post(
      "/login",
      validateRequest_default(loginSchema),
      AuthController.loginUser
    );
    router.get(
      "/me",
      auth_default,
      AuthController.getMe
    );
    auth_route_default = router;
  }
});

// src/app/modules/auth/index.ts
var auth_default2;
var init_auth2 = __esm({
  "src/app/modules/auth/index.ts"() {
    "use strict";
    init_auth_route();
    auth_default2 = auth_route_default;
  }
});

// src/app/middlewares/authorize.ts
import { StatusCodes as StatusCodes3 } from "http-status-codes";
var authorize, authorize_default;
var init_authorize = __esm({
  "src/app/middlewares/authorize.ts"() {
    "use strict";
    init_AppError();
    authorize = (...roles) => (req, _res, next) => {
      if (!req.user) {
        return next(
          new AppError_default(StatusCodes3.UNAUTHORIZED, "Unauthorized")
        );
      }
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError_default(StatusCodes3.FORBIDDEN, "Forbidden")
        );
      }
      next();
    };
    authorize_default = authorize;
  }
});

// src/app/modules/category/category.service.ts
import { StatusCodes as StatusCodes4 } from "http-status-codes";
import { Prisma } from "@prisma/client";
var createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory, CategoryService;
var init_category_service = __esm({
  "src/app/modules/category/category.service.ts"() {
    "use strict";
    init_prisma();
    init_AppError();
    createCategory = async (payload) => {
      const existing = await prisma_default.category.findFirst({
        where: {
          OR: [
            { name: payload.name },
            { slug: payload.slug }
          ]
        }
      });
      if (existing) {
        throw new AppError_default(
          StatusCodes4.BAD_REQUEST,
          "Category already exists"
        );
      }
      return prisma_default.category.create({
        data: payload
      });
    };
    getAllCategories = async (query) => {
      const search = query.search || "";
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      const where = {
        OR: [
          {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive
            }
          },
          {
            slug: {
              contains: search,
              mode: Prisma.QueryMode.insensitive
            }
          }
        ]
      };
      const [categories, total] = await Promise.all([
        prisma_default.category.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          }
        }),
        prisma_default.category.count({
          where
        })
      ]);
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        data: categories
      };
    };
    getSingleCategory = async (id) => {
      const category = await prisma_default.category.findUnique({
        where: {
          id
        }
      });
      if (!category) {
        throw new AppError_default(
          StatusCodes4.NOT_FOUND,
          "Category not found"
        );
      }
      return category;
    };
    updateCategory = async (id, payload) => {
      return prisma_default.category.update({
        where: {
          id
        },
        data: payload
      });
    };
    deleteCategory = async (id) => {
      return prisma_default.category.delete({
        where: {
          id
        }
      });
    };
    CategoryService = {
      createCategory,
      getAllCategories,
      getSingleCategory,
      updateCategory,
      deleteCategory
    };
  }
});

// src/app/modules/category/category.controller.ts
import { StatusCodes as StatusCodes5 } from "http-status-codes";
var createCategory2, getAllCategories2, getSingleCategory2, updateCategory2, deleteCategory2, CategoryController;
var init_category_controller = __esm({
  "src/app/modules/category/category.controller.ts"() {
    "use strict";
    init_catchAsync();
    init_sendResponse();
    init_category_service();
    createCategory2 = catchAsync_default(async (req, res) => {
      const result = await CategoryService.createCategory(req.body);
      sendResponse_default(res, StatusCodes5.CREATED, {
        success: true,
        message: "Category created successfully",
        data: result
      });
    });
    getAllCategories2 = catchAsync_default(async (req, res) => {
      const result = await CategoryService.getAllCategories(req.query);
      sendResponse_default(res, StatusCodes5.OK, {
        success: true,
        message: "Categories retrieved successfully",
        meta: result.meta,
        data: result.data
      });
    });
    getSingleCategory2 = catchAsync_default(async (req, res) => {
      const result = await CategoryService.getSingleCategory(req.params.id);
      sendResponse_default(res, StatusCodes5.OK, {
        success: true,
        message: "Category retrieved successfully",
        data: result
      });
    });
    updateCategory2 = catchAsync_default(async (req, res) => {
      const result = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );
      sendResponse_default(res, StatusCodes5.OK, {
        success: true,
        message: "Category updated successfully",
        data: result
      });
    });
    deleteCategory2 = catchAsync_default(async (req, res) => {
      await CategoryService.deleteCategory(req.params.id);
      sendResponse_default(res, StatusCodes5.OK, {
        success: true,
        message: "Category deleted successfully",
        data: null
      });
    });
    CategoryController = {
      createCategory: createCategory2,
      getAllCategories: getAllCategories2,
      getSingleCategory: getSingleCategory2,
      updateCategory: updateCategory2,
      deleteCategory: deleteCategory2
    };
  }
});

// src/app/modules/category/category.validation.ts
import { z as z2 } from "zod";
var createCategorySchema, updateCategorySchema, CategoryValidation;
var init_category_validation = __esm({
  "src/app/modules/category/category.validation.ts"() {
    "use strict";
    createCategorySchema = z2.object({
      body: z2.object({
        name: z2.string().min(2).max(50),
        slug: z2.string().min(2).max(50),
        image: z2.string().url().optional()
      })
    });
    updateCategorySchema = z2.object({
      body: z2.object({
        name: z2.string().min(2).max(50).optional(),
        slug: z2.string().min(2).max(50).optional(),
        image: z2.string().url().optional()
      })
    });
    CategoryValidation = {
      createCategorySchema,
      updateCategorySchema
    };
  }
});

// src/app/modules/category/category.route.ts
import { Router as Router2 } from "express";
import { UserRole } from "@prisma/client";
var router2, category_route_default;
var init_category_route = __esm({
  "src/app/modules/category/category.route.ts"() {
    "use strict";
    init_auth();
    init_authorize();
    init_validateRequest();
    init_category_controller();
    init_category_validation();
    router2 = Router2();
    router2.get(
      "/",
      CategoryController.getAllCategories
    );
    router2.get(
      "/:id",
      CategoryController.getSingleCategory
    );
    router2.post(
      "/",
      auth_default,
      authorize_default(UserRole.ADMIN),
      validateRequest_default(CategoryValidation.createCategorySchema),
      CategoryController.createCategory
    );
    router2.patch(
      "/:id",
      auth_default,
      authorize_default(UserRole.ADMIN),
      validateRequest_default(CategoryValidation.updateCategorySchema),
      CategoryController.updateCategory
    );
    router2.delete(
      "/:id",
      auth_default,
      authorize_default(UserRole.ADMIN),
      CategoryController.deleteCategory
    );
    category_route_default = router2;
  }
});

// src/app/modules/category/index.ts
var category_default;
var init_category = __esm({
  "src/app/modules/category/index.ts"() {
    "use strict";
    init_category_route();
    category_default = category_route_default;
  }
});

// src/app/modules/gear/gear.validation.ts
import { z as z3 } from "zod";
var createGearSchema, updateGearSchema;
var init_gear_validation = __esm({
  "src/app/modules/gear/gear.validation.ts"() {
    "use strict";
    createGearSchema = z3.object({
      body: z3.object({
        title: z3.string().min(3),
        brand: z3.string().min(2),
        description: z3.string().min(10),
        condition: z3.string(),
        pricePerDay: z3.number().positive(),
        stock: z3.number().int().positive(),
        image: z3.string().url(),
        categoryId: z3.string()
      })
    });
    updateGearSchema = z3.object({
      body: z3.object({
        title: z3.string().min(3).optional(),
        brand: z3.string().min(2).optional(),
        description: z3.string().min(10).optional(),
        condition: z3.string().optional(),
        pricePerDay: z3.number().positive().optional(),
        stock: z3.number().int().positive().optional(),
        image: z3.string().url().optional(),
        categoryId: z3.string().optional()
      })
    });
  }
});

// src/app/modules/gear/gear.service.ts
import { StatusCodes as StatusCodes6 } from "http-status-codes";
var createGear, updateGear, deleteGear, getAllGear, getSingleGear, GearService;
var init_gear_service = __esm({
  "src/app/modules/gear/gear.service.ts"() {
    "use strict";
    init_prisma();
    init_AppError();
    createGear = async (payload, providerId) => {
      const category = await prisma_default.category.findUnique({
        where: {
          id: payload.categoryId
        }
      });
      if (!category) {
        throw new AppError_default(
          StatusCodes6.NOT_FOUND,
          "Category not found"
        );
      }
      const gear = await prisma_default.gearItem.create({
        data: {
          ...payload,
          providerId,
          availableStock: payload.stock,
          isAvailable: payload.stock > 0
        }
      });
      return gear;
    };
    updateGear = async (id, payload, providerId) => {
      const gear = await prisma_default.gearItem.findUnique({
        where: {
          id
        }
      });
      if (!gear) {
        throw new AppError_default(
          StatusCodes6.NOT_FOUND,
          "Gear not found"
        );
      }
      if (gear.providerId !== providerId) {
        throw new AppError_default(
          StatusCodes6.FORBIDDEN,
          "You can update only your own gear"
        );
      }
      const updatedGear = await prisma_default.gearItem.update({
        where: {
          id
        },
        data: {
          ...payload,
          ...payload.stock !== void 0 && {
            availableStock: payload.stock,
            isAvailable: payload.stock > 0
          }
        }
      });
      return updatedGear;
    };
    deleteGear = async (id, providerId) => {
      const gear = await prisma_default.gearItem.findUnique({
        where: {
          id
        }
      });
      if (!gear) {
        throw new AppError_default(
          StatusCodes6.NOT_FOUND,
          "Gear not found"
        );
      }
      if (gear.providerId !== providerId) {
        throw new AppError_default(
          StatusCodes6.FORBIDDEN,
          "You can delete only your own gear"
        );
      }
      await prisma_default.gearItem.delete({
        where: {
          id
        }
      });
      return null;
    };
    getAllGear = async (query) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = query.search;
      const category = query.category;
      const brand = query.brand;
      const available = query.available;
      const minPrice = query.minPrice ? Number(query.minPrice) : void 0;
      const maxPrice = query.maxPrice ? Number(query.maxPrice) : void 0;
      const sortBy = query.sortBy || "createdAt";
      const sortOrder = query.sortOrder || "desc";
      const where = {};
      if (search) {
        where.title = {
          contains: search,
          mode: "insensitive"
        };
      }
      if (category) {
        where.category = {
          slug: category
        };
      }
      if (brand) {
        where.brand = {
          contains: brand,
          mode: "insensitive"
        };
      }
      if (available !== void 0) {
        where.isAvailable = available === "true";
      }
      if (minPrice !== void 0 || maxPrice !== void 0) {
        where.pricePerDay = {};
        if (minPrice !== void 0) {
          where.pricePerDay.gte = minPrice;
        }
        if (maxPrice !== void 0) {
          where.pricePerDay.lte = maxPrice;
        }
      }
      const [data, total] = await Promise.all([
        prisma_default.gearItem.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder
          },
          include: {
            category: true,
            provider: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }),
        prisma_default.gearItem.count({
          where
        })
      ]);
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        data
      };
    };
    getSingleGear = async (id) => {
      const gear = await prisma_default.gearItem.findUnique({
        where: {
          id
        },
        include: {
          category: true,
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      });
      if (!gear) {
        throw new AppError_default(
          StatusCodes6.NOT_FOUND,
          "Gear not found"
        );
      }
      return gear;
    };
    GearService = {
      createGear,
      updateGear,
      deleteGear,
      getAllGear,
      getSingleGear
    };
  }
});

// src/app/modules/gear/gear.controller.ts
import { StatusCodes as StatusCodes7 } from "http-status-codes";
var createGear2, updateGear2, deleteGear2, getAllGear2, getSingleGear2, GearController;
var init_gear_controller = __esm({
  "src/app/modules/gear/gear.controller.ts"() {
    "use strict";
    init_gear_service();
    init_catchAsync();
    init_sendResponse();
    createGear2 = catchAsync_default(async (req, res) => {
      const providerId = req.user.userId;
      const result = await GearService.createGear(req.body, providerId);
      sendResponse_default(res, StatusCodes7.CREATED, {
        success: true,
        message: "Gear created successfully",
        data: result
      });
    });
    updateGear2 = catchAsync_default(async (req, res) => {
      const providerId = req.user.userId;
      const result = await GearService.updateGear(
        req.params.id,
        req.body,
        providerId
      );
      sendResponse_default(res, StatusCodes7.OK, {
        success: true,
        message: "Gear updated successfully",
        data: result
      });
    });
    deleteGear2 = catchAsync_default(async (req, res) => {
      const providerId = req.user.userId;
      await GearService.deleteGear(req.params.id, providerId);
      sendResponse_default(res, StatusCodes7.OK, {
        success: true,
        message: "Gear deleted successfully",
        data: null
      });
    });
    getAllGear2 = catchAsync_default(async (req, res) => {
      const result = await GearService.getAllGear(req.query);
      sendResponse_default(res, StatusCodes7.OK, {
        success: true,
        message: "Gear retrieved successfully",
        meta: result.meta,
        data: result.data
      });
    });
    getSingleGear2 = catchAsync_default(async (req, res) => {
      const result = await GearService.getSingleGear(
        req.params.id
      );
      sendResponse_default(res, StatusCodes7.OK, {
        success: true,
        message: "Gear retrieved successfully",
        data: result
      });
    });
    GearController = {
      createGear: createGear2,
      updateGear: updateGear2,
      deleteGear: deleteGear2,
      getAllGear: getAllGear2,
      getSingleGear: getSingleGear2
    };
  }
});

// src/app/middlewares/verifyToken.ts
import { StatusCodes as StatusCodes8 } from "http-status-codes";
var verifyToken2, verifyToken_default;
var init_verifyToken = __esm({
  "src/app/middlewares/verifyToken.ts"() {
    "use strict";
    init_AppError();
    init_jwt();
    verifyToken2 = (req, res, next) => {
      const authorization = req.headers.authorization;
      if (!authorization) {
        throw new AppError_default(
          StatusCodes8.UNAUTHORIZED,
          "Unauthorized"
        );
      }
      const token = authorization.split(" ")[1];
      if (!token) {
        throw new AppError_default(
          StatusCodes8.UNAUTHORIZED,
          "Unauthorized"
        );
      }
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    };
    verifyToken_default = verifyToken2;
  }
});

// src/app/modules/gear/gear.route.ts
import { Router as Router3 } from "express";
import { UserRole as UserRole2 } from "@prisma/client";
var router3, gear_route_default;
var init_gear_route = __esm({
  "src/app/modules/gear/gear.route.ts"() {
    "use strict";
    init_gear_validation();
    init_authorize();
    init_validateRequest();
    init_gear_controller();
    init_verifyToken();
    router3 = Router3();
    router3.get("/", GearController.getAllGear);
    router3.get("/:id", GearController.getSingleGear);
    router3.post(
      "/",
      verifyToken_default,
      authorize_default(UserRole2.PROVIDER),
      validateRequest_default(createGearSchema),
      GearController.createGear
    );
    router3.patch(
      "/:id",
      verifyToken_default,
      authorize_default(UserRole2.PROVIDER),
      validateRequest_default(updateGearSchema),
      GearController.updateGear
    );
    router3.delete(
      "/:id",
      verifyToken_default,
      authorize_default(UserRole2.PROVIDER),
      GearController.deleteGear
    );
    gear_route_default = router3;
  }
});

// src/app/modules/gear/index.ts
var gear_default;
var init_gear = __esm({
  "src/app/modules/gear/index.ts"() {
    "use strict";
    init_gear_route();
    gear_default = gear_route_default;
  }
});

// src/app/modules/rental/rental.validation.ts
import { RentalStatus } from "@prisma/client";
import { z as z4 } from "zod";
var createRentalSchema, updateRentalStatusSchema;
var init_rental_validation = __esm({
  "src/app/modules/rental/rental.validation.ts"() {
    "use strict";
    createRentalSchema = z4.object({
      body: z4.object({
        gearItemId: z4.string().cuid(),
        quantity: z4.number().int().positive(),
        startDate: z4.coerce.date(),
        endDate: z4.coerce.date()
      })
    });
    updateRentalStatusSchema = z4.object({
      body: z4.object({
        status: z4.nativeEnum(RentalStatus)
      })
    });
  }
});

// src/app/modules/rental/rental.service.ts
import { StatusCodes as StatusCodes9 } from "http-status-codes";
import { RentalStatus as RentalStatus2 } from "@prisma/client";
var allowedTransitions, createRental, getMyRentals, getProviderOrders, updateRentalStatus, RentalService;
var init_rental_service = __esm({
  "src/app/modules/rental/rental.service.ts"() {
    "use strict";
    init_prisma();
    init_AppError();
    allowedTransitions = {
      PLACED: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PAID", "CANCELLED"],
      PAID: ["PICKED_UP"],
      PICKED_UP: ["RETURNED"],
      RETURNED: [],
      CANCELLED: []
    };
    createRental = async (payload, customerId) => {
      const gear = await prisma_default.gearItem.findUnique({
        where: {
          id: payload.gearItemId
        }
      });
      if (!gear) {
        throw new AppError_default(StatusCodes9.NOT_FOUND, "Gear not found");
      }
      if (!gear.isAvailable) {
        throw new AppError_default(
          StatusCodes9.BAD_REQUEST,
          "Gear is currently unavailable"
        );
      }
      if (gear.availableStock < payload.quantity) {
        throw new AppError_default(
          StatusCodes9.BAD_REQUEST,
          "Insufficient stock available"
        );
      }
      const startDate = new Date(payload.startDate);
      const endDate = new Date(payload.endDate);
      if (endDate <= startDate) {
        throw new AppError_default(
          StatusCodes9.BAD_REQUEST,
          "End date must be after start date"
        );
      }
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24)
      );
      const subtotal = days * gear.pricePerDay * payload.quantity;
      const serviceFee = subtotal * 0.05;
      const totalPrice = subtotal + serviceFee;
      const rental = await prisma_default.$transaction(async (tx) => {
        const newRental = await tx.rentalOrder.create({
          data: {
            customerId,
            providerId: gear.providerId,
            gearItemId: gear.id,
            quantity: payload.quantity,
            startDate,
            endDate,
            days,
            pricePerDay: gear.pricePerDay,
            subtotal,
            serviceFee,
            totalPrice
          }
        });
        const updatedGear = await tx.gearItem.update({
          where: {
            id: gear.id
          },
          data: {
            availableStock: {
              decrement: payload.quantity
            }
          }
        });
        if (updatedGear.availableStock === 0) {
          await tx.gearItem.update({
            where: {
              id: gear.id
            },
            data: {
              isAvailable: false
            }
          });
        }
        return newRental;
      });
      return rental;
    };
    getMyRentals = async (customerId, query) => {
      const page = Math.max(Number(query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 10);
      const skip = (page - 1) * limit;
      const status = query.status;
      const where = {
        customerId
      };
      if (status) {
        where.status = status;
      }
      const [data, total] = await Promise.all([
        prisma_default.rentalOrder.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            gearItem: true,
            provider: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }),
        prisma_default.rentalOrder.count({
          where
        })
      ]);
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        data
      };
    };
    getProviderOrders = async (providerId, query) => {
      const page = Math.max(Number(query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 10);
      const skip = (page - 1) * limit;
      const status = query.status;
      const where = {
        providerId
      };
      if (status) {
        where.status = status;
      }
      const [data, total] = await Promise.all([
        prisma_default.rentalOrder.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            gearItem: true
          }
        }),
        prisma_default.rentalOrder.count({
          where
        })
      ]);
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        data
      };
    };
    updateRentalStatus = async (rentalId, providerId, status) => {
      const rental = await prisma_default.rentalOrder.findUnique({
        where: {
          id: rentalId
        },
        include: {
          gearItem: true
        }
      });
      if (!rental) {
        throw new AppError_default(
          StatusCodes9.NOT_FOUND,
          "Rental not found"
        );
      }
      if (rental.providerId !== providerId) {
        throw new AppError_default(
          StatusCodes9.FORBIDDEN,
          "You can only manage your own rentals"
        );
      }
      const allowed = allowedTransitions[rental.status];
      if (!allowed.includes(status)) {
        throw new AppError_default(
          StatusCodes9.BAD_REQUEST,
          `Cannot change status from ${rental.status} to ${status}`
        );
      }
      return prisma_default.$transaction(async (tx) => {
        const updatedRental = await tx.rentalOrder.update({
          where: {
            id: rentalId
          },
          data: {
            status
          }
        });
        if (status === RentalStatus2.CANCELLED || status === RentalStatus2.RETURNED) {
          const updatedGear = await tx.gearItem.update({
            where: {
              id: rental.gearItemId
            },
            data: {
              availableStock: {
                increment: rental.quantity
              }
            }
          });
          if (updatedGear.availableStock > 0 && !updatedGear.isAvailable) {
            await tx.gearItem.update({
              where: {
                id: rental.gearItemId
              },
              data: {
                isAvailable: true
              }
            });
          }
        }
        return updatedRental;
      });
    };
    RentalService = {
      createRental,
      getMyRentals,
      getProviderOrders,
      updateRentalStatus
    };
  }
});

// src/app/modules/rental/rental.controller.ts
import { StatusCodes as StatusCodes10 } from "http-status-codes";
var createRental2, getMyRentals2, getProviderOrders2, updateRentalStatus2, RentalController;
var init_rental_controller = __esm({
  "src/app/modules/rental/rental.controller.ts"() {
    "use strict";
    init_rental_service();
    init_catchAsync();
    init_sendResponse();
    createRental2 = catchAsync_default(async (req, res) => {
      const customerId = req.user.userId;
      const result = await RentalService.createRental(
        req.body,
        customerId
      );
      sendResponse_default(res, StatusCodes10.CREATED, {
        success: true,
        message: "Rental created successfully",
        data: result
      });
    });
    getMyRentals2 = catchAsync_default(async (req, res) => {
      const result = await RentalService.getMyRentals(
        req.user.userId,
        req.query
      );
      sendResponse_default(res, StatusCodes10.OK, {
        success: true,
        message: "Rentals retrieved successfully",
        meta: result.meta,
        data: result.data
      });
    });
    getProviderOrders2 = catchAsync_default(async (req, res) => {
      const result = await RentalService.getProviderOrders(
        req.user.userId,
        req.query
      );
      sendResponse_default(res, StatusCodes10.OK, {
        success: true,
        message: "Orders retrieved successfully",
        meta: result.meta,
        data: result.data
      });
    });
    updateRentalStatus2 = catchAsync_default(
      async (req, res) => {
        const result = await RentalService.updateRentalStatus(
          req.params.id,
          req.user.userId,
          req.body.status
        );
        sendResponse_default(res, StatusCodes10.OK, {
          success: true,
          message: "Rental status updated successfully",
          data: result
        });
      }
    );
    RentalController = {
      createRental: createRental2,
      getMyRentals: getMyRentals2,
      getProviderOrders: getProviderOrders2,
      updateRentalStatus: updateRentalStatus2
    };
  }
});

// src/app/modules/rental/rental.route.ts
import { Router as Router4 } from "express";
import { UserRole as UserRole3 } from "@prisma/client";
var router4, rental_route_default;
var init_rental_route = __esm({
  "src/app/modules/rental/rental.route.ts"() {
    "use strict";
    init_verifyToken();
    init_authorize();
    init_rental_validation();
    init_validateRequest();
    init_rental_controller();
    router4 = Router4();
    router4.post(
      "/",
      verifyToken_default,
      authorize_default(UserRole3.CUSTOMER),
      validateRequest_default(createRentalSchema),
      RentalController.createRental
    );
    router4.get(
      "/my-rentals",
      verifyToken_default,
      authorize_default(UserRole3.CUSTOMER),
      RentalController.getMyRentals
    );
    router4.get(
      "/provider-orders",
      verifyToken_default,
      authorize_default(UserRole3.PROVIDER),
      RentalController.getProviderOrders
    );
    router4.patch(
      "/:id/status",
      verifyToken_default,
      authorize_default(UserRole3.PROVIDER),
      validateRequest_default(updateRentalStatusSchema),
      RentalController.updateRentalStatus
    );
    rental_route_default = router4;
  }
});

// src/app/modules/rental/index.ts
var rental_default;
var init_rental = __esm({
  "src/app/modules/rental/index.ts"() {
    "use strict";
    init_rental_route();
    rental_default = rental_route_default;
  }
});

// src/app/modules/payment/payment.validation.ts
import { z as z5 } from "zod";
var createCheckoutSchema;
var init_payment_validation = __esm({
  "src/app/modules/payment/payment.validation.ts"() {
    "use strict";
    createCheckoutSchema = z5.object({
      body: z5.object({
        rentalOrderId: z5.string().cuid()
      })
    });
  }
});

// src/app/config/stripe.ts
import Stripe from "stripe";
var stripe, stripe_default;
var init_stripe = __esm({
  "src/app/config/stripe.ts"() {
    "use strict";
    init_config();
    stripe = new Stripe(config_default.stripe_secret_key, {
      apiVersion: "2026-06-24.dahlia"
    });
    stripe_default = stripe;
  }
});

// src/app/modules/payment/payment.service.ts
import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus as RentalStatus3,
  UserRole as UserRole4
} from "@prisma/client";
import { StatusCodes as StatusCodes11 } from "http-status-codes";
var createCheckoutSession, handleWebhook, getMyPayments, getProviderPayments, getAllPayments, getPaymentById, PaymentService;
var init_payment_service = __esm({
  "src/app/modules/payment/payment.service.ts"() {
    "use strict";
    init_prisma();
    init_stripe();
    init_config();
    init_AppError();
    createCheckoutSession = async (rentalOrderId, customerId) => {
      const rental = await prisma_default.rentalOrder.findUnique({
        where: {
          id: rentalOrderId
        },
        include: {
          gearItem: true,
          payment: true
        }
      });
      if (!rental) {
        throw new AppError_default(
          StatusCodes11.NOT_FOUND,
          "Rental not found"
        );
      }
      if (rental.customerId !== customerId) {
        throw new AppError_default(
          StatusCodes11.FORBIDDEN,
          "You can only pay for your own rental."
        );
      }
      if (rental.paymentStatus === PaymentStatus.COMPLETED) {
        throw new AppError_default(
          StatusCodes11.BAD_REQUEST,
          "Rental has already been paid."
        );
      }
      const session = await stripe_default.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        success_url: `${config_default.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config_default.client_url}/payment/cancel`,
        metadata: {
          rentalOrderId: rental.id,
          customerId
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: Math.round(rental.totalPrice * 100),
              product_data: {
                name: rental.gearItem.title,
                description: `${rental.days} day rental`
              }
            }
          }
        ]
      });
      return {
        checkoutUrl: session.url,
        sessionId: session.id
      };
    };
    handleWebhook = async (event) => {
      console.log("Handling event:", event.type);
      if (event.type !== "checkout.session.completed") {
        return;
      }
      const session = event.data.object;
      const rentalOrderId = session.metadata?.rentalOrderId;
      if (!rentalOrderId) {
        throw new Error("Missing rentalOrderId");
      }
      await prisma_default.$transaction(async (tx) => {
        const rental = await tx.rentalOrder.findUnique({
          where: {
            id: rentalOrderId
          },
          include: {
            payment: true
          }
        });
        if (!rental) {
          throw new Error("Rental not found");
        }
        if (rental.paymentStatus === PaymentStatus.COMPLETED) {
          return;
        }
        if (rental.payment) {
          await tx.payment.update({
            where: {
              id: rental.payment.id
            },
            data: {
              transactionId: session.payment_intent?.toString() ?? rental.payment.transactionId,
              provider: PaymentProvider.STRIPE,
              status: PaymentStatus.COMPLETED,
              paidAt: /* @__PURE__ */ new Date()
            }
          });
        } else {
          await tx.payment.create({
            data: {
              rentalOrderId: rental.id,
              transactionId: session.payment_intent?.toString() ?? session.id,
              amount: rental.totalPrice,
              provider: PaymentProvider.STRIPE,
              status: PaymentStatus.COMPLETED,
              paidAt: /* @__PURE__ */ new Date()
            }
          });
        }
        await tx.rentalOrder.update({
          where: {
            id: rental.id
          },
          data: {
            paymentStatus: PaymentStatus.COMPLETED,
            status: RentalStatus3.PAID
          }
        });
      });
    };
    getMyPayments = async (customerId, query) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      const where = {
        rentalOrder: {
          customerId
        },
        ...query.status && {
          status: query.status
        }
      };
      const payments = await prisma_default.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          rentalOrder: {
            include: {
              gearItem: {
                include: {
                  category: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: query.sortOrder ?? "desc"
        }
      });
      const total = await prisma_default.payment.count({ where });
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        data: payments
      };
    };
    getProviderPayments = async (providerId, query) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      const where = {
        rentalOrder: {
          providerId
        },
        ...query.status && {
          status: query.status
        }
      };
      const payments = await prisma_default.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          rentalOrder: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              gearItem: true
            }
          }
        },
        orderBy: {
          createdAt: query.sortOrder ?? "desc"
        }
      });
      const total = await prisma_default.payment.count({ where });
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        data: payments
      };
    };
    getAllPayments = async (query) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      const where = {
        ...query.status && {
          status: query.status
        }
      };
      const payments = await prisma_default.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          rentalOrder: {
            include: {
              customer: true,
              provider: true,
              gearItem: {
                include: {
                  category: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: query.sortOrder ?? "desc"
        }
      });
      const total = await prisma_default.payment.count({ where });
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        data: payments
      };
    };
    getPaymentById = async (paymentId, user) => {
      const payment = await prisma_default.payment.findUnique({
        where: {
          id: paymentId
        },
        include: {
          rentalOrder: {
            include: {
              customer: true,
              provider: true,
              gearItem: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });
      if (!payment) {
        throw new AppError_default(
          StatusCodes11.NOT_FOUND,
          "Payment not found"
        );
      }
      if (user.role !== UserRole4.ADMIN && payment.rentalOrder.customerId !== user.userId && payment.rentalOrder.providerId !== user.userId) {
        throw new AppError_default(
          StatusCodes11.FORBIDDEN,
          "Unauthorized"
        );
      }
      return payment;
    };
    PaymentService = {
      createCheckoutSession,
      handleWebhook,
      getMyPayments,
      getProviderPayments,
      getAllPayments,
      getPaymentById
    };
  }
});

// src/app/modules/payment/payment.controller.ts
import { StatusCodes as StatusCodes12 } from "http-status-codes";
var createCheckoutSession2, webhook, getMyPayments2, getProviderPayments2, getAllPayments2, getPaymentById2, PaymentController;
var init_payment_controller = __esm({
  "src/app/modules/payment/payment.controller.ts"() {
    "use strict";
    init_catchAsync();
    init_sendResponse();
    init_payment_service();
    init_stripe();
    init_config();
    createCheckoutSession2 = catchAsync_default(
      async (req, res) => {
        const result = await PaymentService.createCheckoutSession(
          req.body.rentalOrderId,
          req.user.userId
        );
        sendResponse_default(res, StatusCodes12.OK, {
          success: true,
          message: "Checkout session created successfully",
          data: result
        });
      }
    );
    webhook = async (req, res) => {
      const signature = req.headers["stripe-signature"];
      let event;
      try {
        event = stripe_default.webhooks.constructEvent(
          req.body,
          signature,
          config_default.stripe_webhook_secret
        );
      } catch (error) {
        return res.status(400).send("Webhook Error");
      }
      await PaymentService.handleWebhook(event);
      res.json({
        received: true
      });
    };
    getMyPayments2 = catchAsync_default(
      async (req, res) => {
        const result = await PaymentService.getMyPayments(
          req.user.userId,
          req.query
        );
        sendResponse_default(res, StatusCodes12.OK, {
          success: true,
          message: "Payments retrieved successfully",
          meta: result.meta,
          data: result.data
        });
      }
    );
    getProviderPayments2 = catchAsync_default(
      async (req, res) => {
        const result = await PaymentService.getProviderPayments(
          req.user.userId,
          req.query
        );
        sendResponse_default(res, StatusCodes12.OK, {
          success: true,
          message: "Payments retrieved successfully",
          meta: result.meta,
          data: result.data
        });
      }
    );
    getAllPayments2 = catchAsync_default(
      async (req, res) => {
        const result = await PaymentService.getAllPayments(req.query);
        sendResponse_default(res, StatusCodes12.OK, {
          success: true,
          message: "Payments retrieved successfully",
          meta: result.meta,
          data: result.data
        });
      }
    );
    getPaymentById2 = catchAsync_default(
      async (req, res) => {
        const result = await PaymentService.getPaymentById(
          req.params.id,
          req.user
        );
        sendResponse_default(res, StatusCodes12.OK, {
          success: true,
          message: "Payment retrieved successfully",
          data: result
        });
      }
    );
    PaymentController = {
      createCheckoutSession: createCheckoutSession2,
      webhook,
      getMyPayments: getMyPayments2,
      getProviderPayments: getProviderPayments2,
      getAllPayments: getAllPayments2,
      getPaymentById: getPaymentById2
    };
  }
});

// src/app/modules/payment/payment.route.ts
import { Router as Router5 } from "express";
import { UserRole as UserRole5 } from "@prisma/client";
var router5, payment_route_default;
var init_payment_route = __esm({
  "src/app/modules/payment/payment.route.ts"() {
    "use strict";
    init_verifyToken();
    init_authorize();
    init_validateRequest();
    init_payment_validation();
    init_payment_controller();
    router5 = Router5();
    router5.post(
      "/create-checkout-session",
      verifyToken_default,
      authorize_default(UserRole5.CUSTOMER),
      validateRequest_default(createCheckoutSchema),
      PaymentController.createCheckoutSession
    );
    router5.post(
      "/webhook",
      PaymentController.webhook
    );
    router5.get(
      "/my-payments",
      verifyToken_default,
      authorize_default(UserRole5.CUSTOMER),
      PaymentController.getMyPayments
    );
    router5.get(
      "/provider-payments",
      verifyToken_default,
      authorize_default(UserRole5.PROVIDER),
      PaymentController.getProviderPayments
    );
    router5.get(
      "/",
      verifyToken_default,
      authorize_default(UserRole5.ADMIN),
      PaymentController.getAllPayments
    );
    router5.get(
      "/:id",
      verifyToken_default,
      PaymentController.getPaymentById
    );
    payment_route_default = router5;
  }
});

// src/app/modules/payment/index.ts
var payment_default;
var init_payment = __esm({
  "src/app/modules/payment/index.ts"() {
    "use strict";
    init_payment_route();
    payment_default = payment_route_default;
  }
});

// src/app/modules/review/review.service.ts
import {
  PaymentStatus as PaymentStatus2,
  RentalStatus as RentalStatus4
} from "@prisma/client";
import { StatusCodes as StatusCodes13 } from "http-status-codes";
var createReview, updateReview, deleteReview, getReviewsByGear, getProviderReviews, ReviewService;
var init_review_service = __esm({
  "src/app/modules/review/review.service.ts"() {
    "use strict";
    init_prisma();
    init_AppError();
    createReview = async (customerId, payload) => {
      const rental = await prisma_default.rentalOrder.findUnique({
        where: {
          id: payload.rentalOrderId
        },
        include: {
          review: true
        }
      });
      if (!rental) {
        throw new AppError_default(
          StatusCodes13.NOT_FOUND,
          "Rental not found"
        );
      }
      if (rental.customerId !== customerId) {
        throw new AppError_default(
          StatusCodes13.FORBIDDEN,
          "Unauthorized"
        );
      }
      if (rental.status !== RentalStatus4.RETURNED) {
        throw new AppError_default(
          StatusCodes13.BAD_REQUEST,
          "Rental has not been returned yet."
        );
      }
      if (rental.paymentStatus !== PaymentStatus2.COMPLETED) {
        throw new AppError_default(
          StatusCodes13.BAD_REQUEST,
          "Payment not completed."
        );
      }
      if (rental.review) {
        throw new AppError_default(
          StatusCodes13.BAD_REQUEST,
          "Review already submitted."
        );
      }
      if (rental.gearItemId !== payload.gearItemId) {
        throw new AppError_default(
          StatusCodes13.BAD_REQUEST,
          "Gear does not match rental."
        );
      }
      return prisma_default.review.create({
        data: {
          customerId,
          gearItemId: payload.gearItemId,
          rentalOrderId: payload.rentalOrderId,
          rating: payload.rating,
          comment: payload.comment
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true
            }
          },
          gearItem: true
        }
      });
    };
    updateReview = async (reviewId, customerId, payload) => {
      const review = await prisma_default.review.findUnique({
        where: {
          id: reviewId
        }
      });
      if (!review) {
        throw new AppError_default(
          StatusCodes13.NOT_FOUND,
          "Review not found"
        );
      }
      if (review.customerId !== customerId) {
        throw new AppError_default(
          StatusCodes13.FORBIDDEN,
          "You can only update your own review."
        );
      }
      return prisma_default.review.update({
        where: {
          id: reviewId
        },
        data: payload,
        include: {
          customer: {
            select: {
              id: true,
              name: true
            }
          },
          gearItem: true
        }
      });
    };
    deleteReview = async (reviewId, customerId) => {
      const review = await prisma_default.review.findUnique({
        where: {
          id: reviewId
        }
      });
      if (!review) {
        throw new AppError_default(
          StatusCodes13.NOT_FOUND,
          "Review not found"
        );
      }
      if (review.customerId !== customerId) {
        throw new AppError_default(
          StatusCodes13.FORBIDDEN,
          "You can only delete your own review."
        );
      }
      await prisma_default.review.delete({
        where: {
          id: reviewId
        }
      });
      return null;
    };
    getReviewsByGear = async (gearItemId, query) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      const reviews = await prisma_default.review.findMany({
        where: {
          gearItemId
        },
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: query.sortOrder ?? "desc"
        }
      });
      const total = await prisma_default.review.count({
        where: {
          gearItemId
        }
      });
      const aggregate = await prisma_default.review.aggregate({
        where: {
          gearItemId
        },
        _avg: {
          rating: true
        },
        _count: {
          rating: true
        }
      });
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        averageRating: aggregate._avg.rating ?? 0,
        totalRatings: aggregate._count.rating,
        data: reviews
      };
    };
    getProviderReviews = async (providerId, query) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      const reviews = await prisma_default.review.findMany({
        where: {
          gearItem: {
            providerId
          }
        },
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true
            }
          },
          gearItem: {
            select: {
              id: true,
              title: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: query.sortOrder ?? "desc"
        }
      });
      const total = await prisma_default.review.count({
        where: {
          gearItem: {
            providerId
          }
        }
      });
      return {
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit)
        },
        data: reviews
      };
    };
    ReviewService = {
      createReview,
      updateReview,
      deleteReview,
      getReviewsByGear,
      getProviderReviews
    };
  }
});

// src/app/modules/review/review.controller.ts
import { StatusCodes as StatusCodes14 } from "http-status-codes";
var createReview2, updateReview2, deleteReview2, getReviewsByGear2, getProviderReviews2, ReviewController;
var init_review_controller = __esm({
  "src/app/modules/review/review.controller.ts"() {
    "use strict";
    init_catchAsync();
    init_sendResponse();
    init_review_service();
    createReview2 = catchAsync_default(
      async (req, res) => {
        const result = await ReviewService.createReview(
          req.user.userId,
          req.body
        );
        sendResponse_default(res, StatusCodes14.CREATED, {
          success: true,
          message: "Review created successfully",
          data: result
        });
      }
    );
    updateReview2 = catchAsync_default(async (req, res) => {
      const result = await ReviewService.updateReview(
        req.params.id,
        req.user.userId,
        req.body
      );
      sendResponse_default(res, StatusCodes14.OK, {
        success: true,
        message: "Review updated successfully",
        data: result
      });
    });
    deleteReview2 = catchAsync_default(async (req, res) => {
      await ReviewService.deleteReview(
        req.params.id,
        req.user.userId
      );
      sendResponse_default(res, StatusCodes14.OK, {
        success: true,
        message: "Review deleted successfully",
        data: null
      });
    });
    getReviewsByGear2 = catchAsync_default(async (req, res) => {
      const result = await ReviewService.getReviewsByGear(
        req.params.gearId,
        req.query
      );
      sendResponse_default(res, StatusCodes14.OK, {
        success: true,
        message: "Reviews retrieved successfully",
        meta: result.meta,
        data: {
          averageRating: result.averageRating,
          totalRatings: result.totalRatings,
          reviews: result.data
        }
      });
    });
    getProviderReviews2 = catchAsync_default(async (req, res) => {
      const result = await ReviewService.getProviderReviews(
        req.user.userId,
        req.query
      );
      sendResponse_default(res, StatusCodes14.OK, {
        success: true,
        message: "Provider reviews retrieved successfully",
        meta: result.meta,
        data: result.data
      });
    });
    ReviewController = {
      createReview: createReview2,
      updateReview: updateReview2,
      deleteReview: deleteReview2,
      getReviewsByGear: getReviewsByGear2,
      getProviderReviews: getProviderReviews2
    };
  }
});

// src/app/modules/review/review.validation.ts
import { z as z6 } from "zod";
var createReviewSchema, updateReviewSchema;
var init_review_validation = __esm({
  "src/app/modules/review/review.validation.ts"() {
    "use strict";
    createReviewSchema = z6.object({
      body: z6.object({
        gearItemId: z6.string().cuid(),
        rentalOrderId: z6.string().cuid(),
        rating: z6.number().int().min(1).max(5),
        comment: z6.string().min(5).max(500)
      })
    });
    updateReviewSchema = z6.object({
      body: z6.object({
        rating: z6.number().int().min(1).max(5).optional(),
        comment: z6.string().min(5).max(500).optional()
      })
    });
  }
});

// src/app/modules/review/review.route.ts
import { Router as Router6 } from "express";
import { UserRole as UserRole6 } from "@prisma/client";
var router6, review_route_default;
var init_review_route = __esm({
  "src/app/modules/review/review.route.ts"() {
    "use strict";
    init_review_controller();
    init_validateRequest();
    init_authorize();
    init_review_validation();
    init_verifyToken();
    router6 = Router6();
    router6.post(
      "/",
      verifyToken_default,
      authorize_default(UserRole6.CUSTOMER),
      validateRequest_default(createReviewSchema),
      ReviewController.createReview
    );
    router6.patch(
      "/:id",
      verifyToken_default,
      authorize_default(UserRole6.CUSTOMER),
      validateRequest_default(updateReviewSchema),
      ReviewController.updateReview
    );
    router6.delete(
      "/:id",
      verifyToken_default,
      authorize_default(UserRole6.CUSTOMER),
      ReviewController.deleteReview
    );
    router6.get(
      "/gear/:gearId",
      ReviewController.getReviewsByGear
    );
    router6.get(
      "/provider",
      verifyToken_default,
      authorize_default(UserRole6.PROVIDER),
      ReviewController.getProviderReviews
    );
    review_route_default = router6;
  }
});

// src/app/modules/review/index.ts
var review_default;
var init_review = __esm({
  "src/app/modules/review/index.ts"() {
    "use strict";
    init_review_route();
    review_default = review_route_default;
  }
});

// src/app/modules/dashboard/dashboard.service.ts
import {
  PaymentStatus as PaymentStatus3,
  RentalStatus as RentalStatus5,
  UserRole as UserRole7
} from "@prisma/client";
var getCustomerDashboard, getProviderDashboard, getAdminDashboard, DashboardService;
var init_dashboard_service = __esm({
  "src/app/modules/dashboard/dashboard.service.ts"() {
    "use strict";
    init_prisma();
    getCustomerDashboard = async (customerId, query) => {
      const [
        totalRentals,
        activeRentals,
        completedRentals,
        cancelledRentals,
        totalPayments,
        recentRentals
      ] = await Promise.all([
        prisma_default.rentalOrder.count({
          where: {
            customerId
          }
        }),
        prisma_default.rentalOrder.count({
          where: {
            customerId,
            status: {
              in: [
                RentalStatus5.PLACED,
                RentalStatus5.CONFIRMED,
                RentalStatus5.PAID,
                RentalStatus5.PICKED_UP
              ]
            }
          }
        }),
        prisma_default.rentalOrder.count({
          where: {
            customerId,
            status: RentalStatus5.RETURNED
          }
        }),
        prisma_default.rentalOrder.count({
          where: {
            customerId,
            status: RentalStatus5.CANCELLED
          }
        }),
        prisma_default.payment.aggregate({
          where: {
            rentalOrder: {
              customerId
            },
            status: PaymentStatus3.COMPLETED
          },
          _sum: {
            amount: true
          }
        }),
        prisma_default.rentalOrder.findMany({
          where: {
            customerId
          },
          include: {
            gearItem: {
              include: {
                category: true,
                provider: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 5
        })
      ]);
      return {
        summary: {
          totalRentals,
          activeRentals,
          completedRentals,
          cancelledRentals,
          totalPayments: totalPayments._sum.amount ?? 0
        },
        recentRentals
      };
    };
    getProviderDashboard = async (providerId, query) => {
      const [
        totalGear,
        availableGear,
        totalRentals,
        revenue,
        averageRating,
        recentRentals,
        recentReviews,
        topGear,
        rentalStatus,
        completedPayments,
        categories
      ] = await Promise.all([
        // Summary
        prisma_default.gearItem.count({
          where: {
            providerId
          }
        }),
        prisma_default.gearItem.count({
          where: {
            providerId,
            isAvailable: true
          }
        }),
        prisma_default.rentalOrder.count({
          where: {
            providerId
          }
        }),
        prisma_default.payment.aggregate({
          where: {
            rentalOrder: {
              providerId
            },
            status: PaymentStatus3.COMPLETED
          },
          _sum: {
            amount: true
          }
        }),
        prisma_default.review.aggregate({
          where: {
            gearItem: {
              providerId
            }
          },
          _avg: {
            rating: true
          }
        }),
        // Recent Rentals
        prisma_default.rentalOrder.findMany({
          where: {
            providerId
          },
          include: {
            customer: true,
            gearItem: {
              include: {
                category: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 5
        }),
        // Recent Reviews
        prisma_default.review.findMany({
          where: {
            gearItem: {
              providerId
            }
          },
          include: {
            customer: true,
            gearItem: {
              include: {
                category: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 5
        }),
        // Top Rented Gear
        prisma_default.rentalOrder.groupBy({
          by: ["gearItemId"],
          where: {
            providerId
          },
          _sum: {
            quantity: true
          },
          orderBy: {
            _sum: {
              quantity: "desc"
            }
          },
          take: 5
        }),
        // Rental Status
        prisma_default.rentalOrder.groupBy({
          by: ["status"],
          where: {
            providerId
          },
          _count: {
            status: true
          }
        }),
        // Monthly Revenue
        prisma_default.payment.findMany({
          where: {
            rentalOrder: {
              providerId
            },
            status: PaymentStatus3.COMPLETED
          },
          select: {
            amount: true,
            paidAt: true
          }
        }),
        // Category Statistics
        prisma_default.category.findMany({
          include: {
            _count: {
              select: {
                gearItems: {
                  where: {
                    providerId
                  }
                }
              }
            }
          }
        })
      ]);
      const monthlyRevenueMap = {};
      completedPayments.forEach((payment) => {
        if (!payment.paidAt) return;
        const month = payment.paidAt.toLocaleString("en-US", {
          month: "short",
          year: "numeric"
        });
        monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + payment.amount;
      });
      const monthlyRevenue = Object.entries(monthlyRevenueMap).map(
        ([month, revenue2]) => ({
          month,
          revenue: revenue2
        })
      );
      const topRentedGear = await Promise.all(
        topGear.map(async (item) => {
          const gear = await prisma_default.gearItem.findUnique({
            where: {
              id: item.gearItemId
            },
            include: {
              category: true
            }
          });
          return {
            gear,
            totalRentals: item._sum.quantity ?? 0
          };
        })
      );
      return {
        summary: {
          totalGear,
          availableGear,
          totalRentals,
          revenue: revenue._sum.amount ?? 0,
          averageRating: averageRating._avg.rating ?? 0
        },
        recentRentals,
        recentReviews,
        analytics: {
          monthlyRevenue,
          rentalStatus: rentalStatus.map((item) => ({
            status: item.status,
            count: item._count.status
          })),
          topRentedGear,
          categoryStats: categories.map((category) => ({
            category: category.name,
            totalGear: category._count.gearItems
          }))
        }
      };
    };
    getAdminDashboard = async (query) => {
      const [
        totalUsers,
        totalCustomers,
        totalProviders,
        totalGear,
        totalRentals,
        revenue,
        recentPayments,
        recentRentals,
        // Analytics
        completedPayments,
        rentalStatus,
        topGear,
        topRatedGear,
        categories,
        users
      ] = await Promise.all([
        // =========================
        // Dashboard Summary
        // =========================
        prisma_default.user.count(),
        prisma_default.user.count({
          where: {
            role: UserRole7.CUSTOMER
          }
        }),
        prisma_default.user.count({
          where: {
            role: UserRole7.PROVIDER
          }
        }),
        prisma_default.gearItem.count(),
        prisma_default.rentalOrder.count(),
        prisma_default.payment.aggregate({
          where: {
            status: PaymentStatus3.COMPLETED
          },
          _sum: {
            amount: true
          }
        }),
        // =========================
        // Recent Payments
        // =========================
        prisma_default.payment.findMany({
          include: {
            rentalOrder: {
              include: {
                customer: true,
                provider: true,
                gearItem: {
                  include: {
                    category: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 5
        }),
        // =========================
        // Recent Rentals
        // =========================
        prisma_default.rentalOrder.findMany({
          include: {
            customer: true,
            provider: true,
            gearItem: {
              include: {
                category: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 5
        }),
        // =========================
        // Monthly Revenue
        // =========================
        prisma_default.payment.findMany({
          where: {
            status: PaymentStatus3.COMPLETED
          },
          select: {
            amount: true,
            paidAt: true
          }
        }),
        // =========================
        // Rental Status Distribution
        // =========================
        prisma_default.rentalOrder.groupBy({
          by: ["status"],
          _count: {
            status: true
          }
        }),
        // =========================
        // Top 5 Rented Gear
        // =========================
        prisma_default.rentalOrder.groupBy({
          by: ["gearItemId"],
          _sum: {
            quantity: true
          },
          orderBy: {
            _sum: {
              quantity: "desc"
            }
          },
          take: 5
        }),
        // =========================
        // Top Rated Gear
        // =========================
        prisma_default.review.groupBy({
          by: ["gearItemId"],
          _avg: {
            rating: true
          },
          _count: {
            rating: true
          },
          orderBy: {
            _avg: {
              rating: "desc"
            }
          },
          take: 5
        }),
        // =========================
        // Category Statistics
        // =========================
        prisma_default.category.findMany({
          include: {
            _count: {
              select: {
                gearItems: true
              }
            }
          }
        }),
        // =========================
        // Monthly User Registrations
        // =========================
        prisma_default.user.findMany({
          select: {
            createdAt: true
          }
        })
      ]);
      const monthlyRevenueMap = {};
      completedPayments.forEach((payment) => {
        if (!payment.paidAt) return;
        const month = payment.paidAt.toLocaleString("en-US", {
          month: "short",
          year: "numeric"
        });
        monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + payment.amount;
      });
      const monthlyRevenue = Object.entries(monthlyRevenueMap).map(
        ([month, revenue2]) => ({
          month,
          revenue: revenue2
        })
      );
      const monthlyUsersMap = {};
      users.forEach((user) => {
        const month = user.createdAt.toLocaleString("en-US", {
          month: "short",
          year: "numeric"
        });
        monthlyUsersMap[month] = (monthlyUsersMap[month] || 0) + 1;
      });
      const monthlyUsers = Object.entries(monthlyUsersMap).map(
        ([month, users2]) => ({
          month,
          users: users2
        })
      );
      const topRentedGear = await Promise.all(
        topGear.map(async (item) => {
          const gear = await prisma_default.gearItem.findUnique({
            where: {
              id: item.gearItemId
            },
            include: {
              category: true,
              provider: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          });
          return {
            gear,
            totalRentals: item._sum.quantity ?? 0
          };
        })
      );
      const highestRatedGear = await Promise.all(
        topRatedGear.map(async (item) => {
          const gear = await prisma_default.gearItem.findUnique({
            where: {
              id: item.gearItemId
            },
            include: {
              category: true,
              provider: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          });
          return {
            gear,
            averageRating: item._avg.rating ?? 0,
            totalReviews: item._count.rating
          };
        })
      );
      return {
        summary: {
          totalUsers,
          totalCustomers,
          totalProviders,
          totalGear,
          totalRentals,
          totalRevenue: revenue._sum.amount ?? 0
        },
        recentPayments,
        recentRentals,
        analytics: {
          // Revenue Analytics
          monthlyRevenue,
          // Rental Status Analytics
          rentalStatus: rentalStatus.map((item) => ({
            status: item.status,
            count: item._count.status
          })),
          // Most Popular Gear
          topRentedGear,
          // Highest Rated Gear
          topRatedGear: highestRatedGear,
          // Category Statistics
          categoryStats: categories.map((category) => ({
            category: category.name,
            totalGear: category._count.gearItems
          })),
          // User Registration Analytics
          monthlyUsers
        }
      };
    };
    DashboardService = {
      getCustomerDashboard,
      getProviderDashboard,
      getAdminDashboard
    };
  }
});

// src/app/modules/dashboard/dashboard.controller.ts
import { StatusCodes as StatusCodes15 } from "http-status-codes";
var getCustomerDashboard2, getProviderDashboard2, getAdminDashboard2, DashboardController;
var init_dashboard_controller = __esm({
  "src/app/modules/dashboard/dashboard.controller.ts"() {
    "use strict";
    init_catchAsync();
    init_sendResponse();
    init_dashboard_service();
    getCustomerDashboard2 = catchAsync_default(
      async (req, res) => {
        const result = await DashboardService.getCustomerDashboard(
          req.user.userId,
          req.query
        );
        sendResponse_default(res, StatusCodes15.OK, {
          success: true,
          message: "Customer dashboard retrieved successfully",
          data: result
        });
      }
    );
    getProviderDashboard2 = catchAsync_default(
      async (req, res) => {
        const result = await DashboardService.getProviderDashboard(
          req.user.userId,
          req.query
        );
        sendResponse_default(res, StatusCodes15.OK, {
          success: true,
          message: "Provider dashboard retrieved successfully",
          data: result
        });
      }
    );
    getAdminDashboard2 = catchAsync_default(
      async (req, res) => {
        const result = await DashboardService.getAdminDashboard(
          req.query
        );
        sendResponse_default(res, StatusCodes15.OK, {
          success: true,
          message: "Admin dashboard retrieved successfully",
          data: result
        });
      }
    );
    DashboardController = {
      getCustomerDashboard: getCustomerDashboard2,
      getProviderDashboard: getProviderDashboard2,
      getAdminDashboard: getAdminDashboard2
    };
  }
});

// src/app/modules/dashboard/dashboard.route.ts
import { Router as Router7 } from "express";
import { UserRole as UserRole8 } from "@prisma/client";
var router7, dashboard_route_default;
var init_dashboard_route = __esm({
  "src/app/modules/dashboard/dashboard.route.ts"() {
    "use strict";
    init_dashboard_controller();
    init_authorize();
    init_verifyToken();
    router7 = Router7();
    router7.get(
      "/customer",
      verifyToken_default,
      authorize_default(UserRole8.CUSTOMER),
      DashboardController.getCustomerDashboard
    );
    router7.get(
      "/provider",
      verifyToken_default,
      authorize_default(UserRole8.PROVIDER),
      DashboardController.getProviderDashboard
    );
    router7.get(
      "/admin",
      verifyToken_default,
      authorize_default(UserRole8.ADMIN),
      DashboardController.getAdminDashboard
    );
    dashboard_route_default = router7;
  }
});

// src/app/modules/dashboard/index.ts
var dashboard_default;
var init_dashboard = __esm({
  "src/app/modules/dashboard/index.ts"() {
    "use strict";
    init_dashboard_route();
    dashboard_default = dashboard_route_default;
  }
});

// src/app/routes/index.ts
import { Router as Router8 } from "express";
var router8, routes_default;
var init_routes = __esm({
  "src/app/routes/index.ts"() {
    "use strict";
    init_auth2();
    init_category();
    init_gear();
    init_rental();
    init_payment();
    init_review();
    init_dashboard();
    router8 = Router8();
    router8.use("/auth", auth_default2);
    router8.use("/categories", category_default);
    router8.use("/gear", gear_default);
    router8.use("/provider/gear", gear_default);
    router8.use("/rentals", rental_default);
    router8.use("/payments", payment_default);
    router8.use("/reviews", review_default);
    router8.use("/dashboard", dashboard_default);
    router8.get("/", (_req, res) => {
      res.json({
        success: true,
        message: "GearUp API Running"
      });
    });
    routes_default = router8;
  }
});

// src/app/middlewares/notFound.ts
var notFound, notFound_default;
var init_notFound = __esm({
  "src/app/middlewares/notFound.ts"() {
    "use strict";
    notFound = (req, res) => {
      res.status(404).json({
        success: false,
        message: "API Not Found"
      });
    };
    notFound_default = notFound;
  }
});

// src/app/errors/handlePrismaError.ts
var handlePrismaError, handlePrismaError_default;
var init_handlePrismaError = __esm({
  "src/app/errors/handlePrismaError.ts"() {
    "use strict";
    handlePrismaError = (error) => {
      if (error.code === "P2002") {
        return {
          statusCode: 409,
          message: "Duplicate value",
          errorDetails: [
            {
              path: "",
              message: "Unique constraint failed"
            }
          ]
        };
      }
      return {
        statusCode: 500,
        message: "Database Error",
        errorDetails: [
          {
            path: "",
            message: error.message
          }
        ]
      };
    };
    handlePrismaError_default = handlePrismaError;
  }
});

// src/app/errors/handleZodError.ts
var handleZodError, handleZodError_default;
var init_handleZodError = __esm({
  "src/app/errors/handleZodError.ts"() {
    "use strict";
    handleZodError = (error) => {
      return {
        statusCode: 400,
        message: "Validation Error",
        errorDetails: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      };
    };
    handleZodError_default = handleZodError;
  }
});

// src/app/middlewares/globalErrorHandler.ts
import { Prisma as Prisma2 } from "@prisma/client";
import { ZodError } from "zod";
var globalErrorHandler, globalErrorHandler_default;
var init_globalErrorHandler = __esm({
  "src/app/middlewares/globalErrorHandler.ts"() {
    "use strict";
    init_AppError();
    init_handlePrismaError();
    init_handleZodError();
    globalErrorHandler = (err, req, res, next) => {
      let statusCode = 500;
      let message = "Something went wrong";
      let errorDetails = [];
      if (err instanceof ZodError) {
        const simplified = handleZodError_default(err);
        statusCode = simplified.statusCode;
        message = simplified.message;
        errorDetails = simplified.errorDetails;
      } else if (err instanceof Prisma2.PrismaClientKnownRequestError) {
        const simplified = handlePrismaError_default(err);
        statusCode = simplified.statusCode;
        message = simplified.message;
        errorDetails = simplified.errorDetails;
      } else if (err instanceof AppError_default) {
        statusCode = err.statusCode;
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
        stack: process.env.NODE_ENV === "development" ? err.stack : void 0
      });
    };
    globalErrorHandler_default = globalErrorHandler;
  }
});

// src/app.ts
import express from "express";
import cors from "cors";
var app, app_default;
var init_app = __esm({
  "src/app.ts"() {
    "use strict";
    init_routes();
    init_notFound();
    init_globalErrorHandler();
    app = express();
    app.use(cors());
    app.use(
      "/api/v1/payments/webhook",
      express.raw({ type: "application/json" })
    );
    app.use(express.json());
    app.use("/api/v1", routes_default);
    app.get("/", (_req, res) => {
      res.json({
        success: true,
        message: "GearUp Backend API Running"
      });
    });
    app.use(notFound_default);
    app.use(globalErrorHandler_default);
    app_default = app;
  }
});

// src/server.ts
import "dotenv/config";
var require_server = __commonJS({
  "src/server.ts"() {
    init_app();
    init_config();
    var PORT = config_default.port;
    async function main() {
      try {
        app_default.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      } catch (error) {
        console.error("error starting the server", error);
        process.exit(1);
      }
    }
    main();
  }
});
export default require_server();
//# sourceMappingURL=server.mjs.map