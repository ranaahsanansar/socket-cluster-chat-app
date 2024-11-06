export const navClass = [
  "uppercase tracking-wide border border-transparent group",
  "data-[active=true]:rounded-small hover:rounded-small",
  "data-[active=true]:bg-primaryLight hover:bg-primaryLight",
  "data-[active=true]:border-borderColor hover:border-borderColor",
  "data-[active=true]:font-normal",
  "data-[active=true]:text-secondary hover:text-secondary [&>*]:data-[active=true]:fill-secondary [&>*]:hover:fill-secondary [&>*]:fill-white",
]
export const navbarClass = {
  base: ["flex-col text-white justify-start"],
  wrapper: ["flex-col items-start p-0 h-full"],
  content: ["flex-col items-stretch gap-2 w-full"],
  item: navClass,
}

export const NavBtnSvg1 = () => {
  return (<><svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    viewBox="0 0 384 512"
  >
    <path
      fill="white"
      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
    />
  </svg></>)
}

export const NavBtnSvg2 = () => {
  return (<><svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="14"
    viewBox="0 0 20 14"
  >
    <path
      d="M7.77778 14H12.2222V11.6667H7.77778V14ZM0 0V2.33334H20V0H0ZM3.33333 8.16667H16.6667V5.83335H3.33333V8.16667Z"
      fill="white"
    ></path>
  </svg></>)
}