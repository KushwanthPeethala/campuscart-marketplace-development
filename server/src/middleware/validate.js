/** Parse req[source] with a zod schema and replace it with the cleaned result. */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source])
  if (!result.success) return next(result.error)
  if (source === 'query') Object.defineProperty(req, 'query', { value: result.data, writable: true })
  else req[source] = result.data
  next()
}
