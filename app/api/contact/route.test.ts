
import { POST } from './route';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Mock googleapis
jest.mock('googleapis', () => {
  const mockDrive = {
    files: {
      list: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    google: {
      auth: {
        GoogleAuth: jest.fn().mockImplementation(() => ({})),
      },
      drive: jest.fn(() => mockDrive),
    },
  };
});

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      data,
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe('Contact API', () => {
  let mockDrive: any;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_DRIVE_FOLDER_ID = 'test-folder-id';
    mockDrive = (google.drive as jest.Mock)();
  });

  it('POST creates new file if none exists', async () => {
    mockDrive.files.list.mockResolvedValue({
      data: { files: [] },
    });
    mockDrive.files.create.mockResolvedValue({});

    const formData = new FormData();
    formData.append('name', 'John');
    formData.append('message', 'Test Message');

    const req = {
      formData: async () => formData,
    } as any;

    const response = await POST(req);
    expect(response.status).toBe(200);

    expect(mockDrive.files.create).toHaveBeenCalled();
    const createCall = mockDrive.files.create.mock.calls[0];
    const createdBody = JSON.parse(createCall[0].media.body);
    expect(createdBody.length).toBe(1);
    expect(createdBody[0].name).toBe('John');
  });

  it('POST updates existing file', async () => {
    mockDrive.files.list.mockResolvedValue({
      data: { files: [{ id: 'existing-id' }] },
    });
    mockDrive.files.get.mockResolvedValue({
      data: [{ id: 1, name: 'Old' }],
    });
    mockDrive.files.update.mockResolvedValue({});

    const formData = new FormData();
    formData.append('name', 'New');

    const req = {
      formData: async () => formData,
    } as any;

    await POST(req);

    expect(mockDrive.files.update).toHaveBeenCalled();
    const updateCall = mockDrive.files.update.mock.calls[0];
    const updatedBody = JSON.parse(updateCall[0].media.body);
    expect(updatedBody.length).toBe(2);
    expect(updatedBody[1].name).toBe('New');
  });
});
