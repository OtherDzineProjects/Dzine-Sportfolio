import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Typography
} from "common";
import { colors } from "utils/colors";

export default function DynamicDrawer({
  title,
  isOpen = false,
  size = "lg",
  placement = "right",
  onClose = () => {},
  searchMode = "minimal",
  setSearchMode = () => {},
  hideMinimalAdvancedButtons = false,
  children
}) {
  return (
    <Drawer isOpen={isOpen} placement={placement} onClose={onClose} size={size}>
      <DrawerOverlay bg="rgba(38, 50, 56, 0.6)" />
      <DrawerContent borderRadius={0}>
        <DrawerHeader
          bg={`${colors.white} !important`}
          fontSize="1.125rem"
          borderBottom={`1px solid ${colors.light}`}
        >
          <header className="flex items-center justify-between me-6">
            <Typography text={title} type="p" size="sm" />

            {!hideMinimalAdvancedButtons && (
              <Button
                variant="outline"
                colorScheme="blue"
                borderColor={colors.primaryColor}
                color={colors.primaryColor}
                size="sm"
                onClick={() =>
                  setSearchMode(
                    searchMode === "minimal" ? "advanced" : "minimal"
                  )
                }
              >
                {`${searchMode === "minimal" ? "Advanced" : "Minimal"} Search`}
              </Button>
            )}
            <DrawerCloseButton />
          </header>
        </DrawerHeader>
        <DrawerBody maxH="100%">{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
