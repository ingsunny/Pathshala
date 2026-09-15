export default function ExternalImage({ alt = "", ...props }) {
  // Course and profile images come from user data and can use arbitrary hosts.
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} {...props} />;
}
