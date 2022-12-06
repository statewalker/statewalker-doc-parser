export default function toTextToken({
  type = "Text",
  start,
  end,
  ...options
}) {
  return {
    type,
    start,
    end,
    ...options,
  };
}
