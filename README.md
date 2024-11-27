# back template

VITE_BACK_URL="https://back-template-smdev.onrender.com"

## routes

### /auth

#### /google/authorize

    - method: post
    - body_params:
        - redirect_uri: required
    - return: url

#### /google/callback

    - method: post
    - body_params:
        - redirect_uri: required
        - code: required
    - return: user, status, token

### /facebook/authorize

    - method: post
    - body_params:
        - redirect_uri: required
    - return: url

### /facebook/callback

    - method: post
    - body_params:
        - redirect_uri: required
        - code: required
    - return: user, status, token

### /user/update-with-provider

    - method: post
    - isProtected: true
    - body_params:
        - provider: required
        - providerId: required
        - email: optional [unique, emailFormat]
        - fullname: optional
        - phone: optional
        - role: optional (enum: ['driver', 'transporter', 'super-admin'])
    - return: user, status, token

### /user/get-with-provider

    - method: POST
    - isProtected: true
    - body_params:
        - provider: required
        - providerId: required
    - return: user, status, token

## entities

### users:

    - _id: string
    - email: string
    - fullname: string
    - phone: string
    - role: string
    - provider: string
    - providerId: string
    - companyId: string

### companies:

    - _id: string
    - name: string
    - createdBy: string

### trucks:

    - _id: string
    - companyId: string
    - plateNumber: string
    - model: string
    - year: string
    - createdBy: string
    - responsible: string

### maintenances:

    - _id: string
    - createdBy: string
    - companyId: string
    - truckId: string
    - responsible: string
    - date: string
    - description: string
    - typeEntretienId: string

### maintenanceTypes:

    - _id: string
    - name: string

### locations:

    - _id: string
    - companyId: string
    - createdBy: string
    - name: string
    - phone: string
    - email: string
    - address: string
    - latitude: string
    - longitude: string

### trips:

    - _id: string
    - createdBy: string
    - companyId: string
    - truckId: string
    - driverId: string
    - originId: string
    - destinationId: string
    - date: string
    - status: enum ['pending', 'in-progress', 'completed', 'canceled', 'scheduled']
    - description: string
    - distance: number
    - price: number
    - weight: number
    - NoPallets: number

### attachments:

    - _id: string
    - createdBy: string
    - companyId: string
    - entityId: string
    - name: string
    - url: string
    - isFavorite: boolean

## roles

### super-admin

    - can manage all entities

### driver

    - can manage trips where he is the driver
    - can manage trucks where he is the responsible
    - can't assign a trip to another driver
    - can't assign a truck to another driver
    - can't assign maintenances to another driver
    - can't manage trips where he is not the driver
    - can't manage trucks where he is not the responsible
    - can't manage maintenances where he is not responsible
    - can't manage locations where he is not the createdBy
    - can't manage attachments where he is not the createdBy

### transporter

    - can manage all entities of its company

## entities names:

    - users
    - companies
    - locations
    - trucks
    - trips
    - maintenanceTypes
    - maintenances
    - attachments

## actions

### super-admin

    - all actions

### driver

    - add
        - locations
        - trucks
        - trips
        - maintenances
        - attachments
    - update
        - trucks
            - companyId: NOT_ALLOWED
            - plateNumber: ALLOWED
            - model: ALLOWED
            - year: ALLOWED
            - createdBy: NOT_ALLOWED
            - responsible: NOT_ALLOWED
        - trips
            - companyId: NOT_ALLOWED
            - truckId: NOT_ALLOWED
            - driverId: NOT_ALLOWED
            - distance: CALCULATED
            - originId: ALLOWED
            - destinationId: ALLOWED
            - date: ALLOWED
            - status: ALLOWED
            - description: ALLOWED
            - price: ALLOWED
            - weight: ALLOWED
            - NoPallet: ALLOWED
        - maintenances
            - companyId: NOT_ALLOWED
            - truckId: NOT_ALLOWED
            - responsible: NOT_ALLOWED
            - date: ALLOWED
            - description: ALLOWED
            - createdBy: NOT_ALLOWED
            - typeEntretienId: ALLOWED
        - attachments
            - companyId: NOT_ALLOWED
            - entityId: NOT_ALLOWED
            - url: NOT_ALLOWED
            - name: ALLOWED
            - isFavorite: ALLOWED
    - delete
        - attachments
    - get
        - locations of company
        - trucks where he is the responsible
        - trips where he is the driver
        - maintenances where he is the responsible
        - attachments of the entities he is responsible

### transporter

    - add
        - locations
        - trucks
        - trips
        - maintenances
        - attachments
    - update
        - trucks
            - companyId: NOT_ALLOWED
            - createdBy: NOT_ALLOWED
            - plateNumber: ALLOWED
            - model: ALLOWED
            - year: ALLOWED
            - responsible: ALLOWED
        - trips
            - companyId: NOT_ALLOWED
            - distance: CALCULATED
            - truckId: ALLOWED
            - driverId: ALLOWED
            - originId: ALLOWED
            - destinationId: ALLOWED
            - date: ALLOWED
            - status: ALLOWED [where it is scheduled]
            - description: ALLOWED
            - price: ALLOWED
            - weight: ALLOWED
            - NoPallet: ALLOWED
        - maintenances
            - companyId: NOT_ALLOWED
            - truckId: NOT_ALLOWED
            - createdBy: NOT_ALLOWED
            - responsible: ALLOWED
            - date: ALLOWED
            - description: ALLOWED
            - typeEntretienId: ALLOWED
        - attachments
            - companyId: NOT_ALLOWED
            - entityId: NOT_ALLOWED
            - url: NOT_ALLOWED
            - name: ALLOWED
            - isFavorite: ALLOWED
    - delete
        - attachments
    - get
        - locations of company
        - trucks of company
        - trips of company
        - maintenances of company
        - attachments of the entities of company

## methods

### template

    - request
        - /api/v1/ressource
            - get
            - post
        - /api/v1/ressource/:id
            - get
            - put
            - delete
        - search (optional)
            - /api/v1/ressource/search?query=string
    - response
        - OK
            - status: 200
                - data: any
        - CREATED
            - status: 201
                - data: any
        - BAD_REQUEST
            - description: validation error of arguments
            - status: 400
                message: string
        - UNAUTHENTICATED
            - status: 401
                message: string
        - FORBIDDEN
            - status: 403
                message: string
        - NOT_FOUND
            - status: 404
                message: string
        - INTERNAL_SERVER_ERROR
            - status: 500
                message: string
    - token
        - Bearer token
        - expires in 1 day
        - refresh token if expired authomaticaly
        - the token is sent for the first time in the response of:
            - /auth/google/callback
            - /auth/facebook/callback
