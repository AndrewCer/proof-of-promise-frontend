export enum ErrorCode {
    contractMethodMissing = 'Contract method does not exist',
    entityExists = 'Entity already exists',
    entityDoesntExist = 'Entity does NOT exists',
    inputTextTooLong = 'Input text too long',
    inputTextTooShort = 'Input text too short',
    invalidRequest = 'Invalid request',
    invalidToken = 'Invalid token',
    noDataReturned = 'No data was returned', // Use when the model doesn't return any data.
    notEnoughPoints = 'Not enough points',
    unauthorized = 'Unauthorized',
    integrationServerError = '500 integration server error',
    txnError = 'Error while submitting transaction',
}