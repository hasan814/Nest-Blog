import { applyDecorators } from "@nestjs/common"
import { ApiQuery } from "@nestjs/swagger"

export const FilterBlog = () => {
  return applyDecorators(
    ApiQuery({ name: "category", required: false }),
    ApiQuery({ name: "search", required: false })
  )
}