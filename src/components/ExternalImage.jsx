export default function ExternalImage({
  alt = "",
  referrerPolicy = "no-referrer",
  ...props
}) {
  // Course and profile images come from user data and can use arbitrary hosts.
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} referrerPolicy={referrerPolicy} {...props} />;
}
