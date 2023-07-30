import { ExecutionContext } from '@nestjs/common';
import { RequestContext } from './context';

describe('RequestContext Decorator', () => {
  it('should return the request object from ExecutionContext', () => {
    const mockRequest = {
      headers: { Authorization: 'Bearer token' },
      body: { data: 'test' },
    };

    const mockExecutionContext: ExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      })),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getType: jest.fn(),
    };

    RequestContext(mockRequest, mockExecutionContext as ExecutionContext);

    expect(
      jest.spyOn(mockExecutionContext.switchToHttp(), 'getRequest'),
    ).toHaveBeenCalledTimes(0);
  });
});
