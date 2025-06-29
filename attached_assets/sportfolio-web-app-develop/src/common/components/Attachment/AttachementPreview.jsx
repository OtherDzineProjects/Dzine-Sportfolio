import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Typography,
  useDisclosure
} from "common";
import {
  setDocumentList,
  setSelectedDocument,
  setShowDocumentModal
} from "pages/common/slice";
import { useMemo } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "utils/colors";
import "./styles.css";
import { DOTS, usePagination } from "../Table/Pagination/usePagination";

export default function AttachementPreview() {
  const { isOpen, onOpen, onClose } = useDisclosure(),
    {
      showDocumentModal,
      documentList = [],
      selectedDocument
    } = useSelector((state) => state.common),
    dispatch = useDispatch();

  const onCloseModal = () => {
    dispatch(setShowDocumentModal(false));
    dispatch(setDocumentList([]));
    onClose();
  };

  useEffect(() => {
    showDocumentModal ? onOpen() : onClose();
  }, [showDocumentModal]);

  const currentPage = useMemo(() => {
    return (
      documentList.findIndex(
        (item) => item.documentID === selectedDocument?.documentID
      ) + 1
    );
  }, [selectedDocument, documentList]);

  const currentFileType = useMemo(() => {
    if (!selectedDocument) return;
    if (selectedDocument?.path?.includes(".pdf")) {
      return "pdf";
    } else if (
      selectedDocument?.path?.includes(".png") ||
      selectedDocument?.path?.includes(".jpg") ||
      selectedDocument?.path?.includes(".jpeg")
    ) {
      return "image";
    }
  }, [selectedDocument]);

  const totalCount = useMemo(
    () => (documentList?.length ? documentList?.length : 0),
    [documentList]
  );

  const onPrevious = () => {
    if (currentPage === 1) return;
    dispatch(setSelectedDocument(documentList[currentPage - 2]));
  };
  const onNext = () => {
    if (currentPage === documentList?.length) return;
    dispatch(setSelectedDocument(documentList[currentPage]));
  };

  const siblingCount = 1,
    pageSize = 1;

  const paginationRange = usePagination(
    {
      currentPage,
      totalCount,
      siblingCount,
      pageSize
    },
    [documentList]
  );

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="xl"
      closeOnOverlayClick={false}
      onCloseComplete={onCloseModal}
      onEsc={onCloseModal}
    >
      <ModalOverlay bg="rgba(38, 50, 56, 0.6)" />
      <ModalContent>
        <ModalHeader
          bg={`${colors.white} !important`}
          fontSize="1.125rem"
          borderBlockEnd="1px solid rgba(241, 245, 249, 1)"
          fontWeight={400}
          flex
          alignItems="center"
        >
          <Typography
            text={`Documents: ${
              selectedDocument ? selectedDocument?.fileName : ""
            }`}
            type="p"
            size="sm"
          />

          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <section>
            <main>
              {selectedDocument && currentFileType === "pdf" ? (
                <iframe
                  id="myPdf"
                  type="application/pdf"
                  src={selectedDocument ? selectedDocument?.path : ""}
                  width="100%"
                  height="100%"
                  className="w-full h-[55svh] aspect-auto"
                ></iframe>
              ) : (
                <img
                  src={selectedDocument ? selectedDocument?.path : ""}
                  alt="selectedImage"
                  className="w-full h-[55svh] object-contain aspect-auto"
                />
              )}
            </main>
            <footer className="flex gap-2 flex-wrap items-center justify-center mt-4 mb-2">
              <div
                title="Previous"
                disabled={currentPage === 1}
                onClick={onPrevious}
                className={`pagination-key ${
                  currentPage === 1 ? "disabled" : ""
                } `}
              >
                <svg
                  opacity={currentPage === 1 ? 0.5 : 1}
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 6 8"
                  fill="none"
                >
                  <path
                    d="M5.15151 1.02838L0.984375 4.01419L5.15151 7"
                    stroke="#454545"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {paginationRange?.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                  return (
                    <div
                      key={`${pageNumber}-${index}`}
                      className={`pagination-key ${
                        currentPage === index + 1 ? "active" : ""
                      } `}
                    >
                      &#8230;
                    </div>
                  );
                }

                return (
                  <div
                    className={`pagination-key ${
                      currentPage === pageNumber ? "active" : ""
                    } `}
                    key={`${pageNumber}-${index}`}
                    onClick={() =>
                      dispatch(
                        setSelectedDocument(documentList[pageNumber - 1])
                      )
                    }
                  >
                    {pageNumber}
                  </div>
                );
              })}

              <div
                title="Next"
                disabled={currentPage === documentList.length}
                onClick={onNext}
                className={`pagination-key ${
                  currentPage === documentList.length ? "disabled" : ""
                } `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 6 8"
                  opacity={currentPage === 1 ? 0.5 : 1}
                  fill="none"
                >
                  <path
                    d="M0.984233 6.97162L5.15137 3.98581L0.984233 1"
                    stroke="#454545"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </footer>
          </section>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
