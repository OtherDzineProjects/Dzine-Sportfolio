import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
    colors: {
      primary: {
        500: "rgb(7, 141, 238)"
      },
      secondary: {
        500: "#FF2457"
      }
    }
  })

  export { theme}