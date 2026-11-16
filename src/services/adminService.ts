import { http } from "@/lib/http-auth-client";
import type { PagedResult } from "./common.types";
import type { MentorListItemDto } from "./mentorService";

export const adminService = {
  listMentorsForVerification: async (
    status = "Pending",
    page = 1,
    pageSize = 10,
  ): Promise<PagedResult<MentorListItemDto>> => {
    return http.get<PagedResult<MentorListItemDto>>(
      "/api/v1/profiles/mentors",
      {
        params: {
          verificationStatus: status,
          page,
          pageSize,
        },
      },
    );
  },

  verifyMentor: async (
    mentorId: string,
    verificationStatus: "Verified" | "Pending" | "Unverified",
  ): Promise<void> => {
    await http.put(`/api/v1/profiles/mentors/${mentorId}/verification`, {
      verificationStatus,
    });
  },
};
