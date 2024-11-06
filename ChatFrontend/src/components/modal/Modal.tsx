import { Modal as NextModal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import Button from "../Button";
import { CrossIcon } from "../constants/Icons";

const Modal = ({
    isOpen,
    onOpenChange,
    size,
    primaryButtonAction,
    primaryButtonText = "Launch",
    secondaryButtonText = "Cancel",
    children,
    hidePrimaryButton = true
}: {
    isOpen: any
    onOpenChange: any
    size?: any
    primaryButtonAction?: any
    primaryButtonText?: string
    secondaryButtonText?: string
    hidePrimaryButton?: boolean
    children: React.ReactNode
}) => {
    return (
        <NextModal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior={"inside"} className={"bg-primary text-white"} size={size ? size : "4xl"} closeButton={<div><CrossIcon /></div>} classNames={{
            closeButton: "hover:bg-transparent active:bg-transparent m-2"
        }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody className="mt-4">
                            {children}
                        </ModalBody>
                        <ModalFooter className="mb-4">
                            <Button variant="secondary" onClick={onClose}>
                                {secondaryButtonText}
                            </Button>
                            {hidePrimaryButton && <Button onClick={primaryButtonAction}>
                                {primaryButtonText}
                            </Button>}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </NextModal>
    )
}

export default Modal