/**
 * Shared API response types matching .NET backend conventions.
 *
 * - Paginated lists use `PagedResult<T>`.
 * - Errors follow RFC 7807 Problem Details.
 * - Commands without a response body return 204 No Content.
 */

/* ------------------------------------------------------------------ */
/*  Pagination                                                        */
/* ------------------------------------------------------------------ */

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/* ------------------------------------------------------------------ */
/*  RFC 7807 Problem Details                                          */
/* ------------------------------------------------------------------ */

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  /** Field-level validation errors: `{ "Email": ["Email không được để trống."] }` */
  errors?: Record<string, string[]>;
  correlationId?: string;
}

/* ------------------------------------------------------------------ */
/*  API Error class                                                   */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly problem?: ProblemDetails | null,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** Returns the first validation error for a given field, or undefined. */
  fieldError(field: string): string | undefined {
    return this.problem?.errors?.[field]?.[0];
  }

  /** Returns all validation errors flattened into a single object. */
  get fieldErrors(): Record<string, string> | undefined {
    if (!this.problem?.errors) return undefined;
    const result: Record<string, string> = {};
    for (const [key, messages] of Object.entries(this.problem.errors)) {
      if (messages.length > 0) result[key] = messages[0];
    }
    return result;
  }
}
