import ReactPaginate from "react-paginate";
import React, { useState } from "react";
import Select from "react-select";
import { paginationData } from "../../data/PaginationDefault";

interface PaginationProps {
    handlePageClick: (data: any) => void,
    pageCount: number,
    limit: number,
    forcePage?: number,
    loading: boolean,
    updatePerPage?: (limit: number) => void
    selectedLimit?: number,
    hidePerPageSelect?: boolean
}

export const Pagination = ({
                               handlePageClick,
                               pageCount,
                               forcePage,
                               loading,
                               updatePerPage,
                               selectedLimit,
                               hidePerPageSelect = false
                           }: PaginationProps) => {


    const [dropdownOpen, setDropdownOpen] = useState(false);
    const pages = [
        { 'label': '5', 'value': 5 },
        { 'label': '10', 'value': 10 },
        { 'label': '20', 'value': 20 },
        { 'label': '100', 'value': 100 },
    ]

    const getSelectedOption = (selectedLimit: number) => {

        return pages.filter((item: any) => {
            return item.value == selectedLimit
        })[0];
    }


    return (<div className="wrt-flex wrt-flex-row wrt-justify-end wrt-gap-6">

        {hidePerPageSelect ? null : (
            <div
                className="wrt-flex wrt-justify-center wrt-items-center wrt-gap-3">

                <Select styles={{
                    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                        return {
                            ...styles,
                            backgroundColor: isFocused ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                            color: isFocused ? "hsl(var(--secondary))" : "hsl(var(--primary))"
                        };
                    }
                }}
                        classNamePrefix="wrt-"
                        onChange={(selectedOption: any) => {
                            updatePerPage ? updatePerPage(selectedOption.value) : null
                        }}
                        options={pages}
                        defaultValue={getSelectedOption(selectedLimit ?? paginationData.per_page)}
                ></Select>
            </div>
        )}
        <div>
            <ReactPaginate
                previousLabel={
                    <i className="wpr wpr-back-arrow wrt-w-9 wrt-h-9 wrt-flex wrt-justify-center wrt-items-center hover:wrt-bg-light-gray"></i>
                }
                nextLabel={
                    <i className="wpr wpr-forward-arrow wrt-w-9 wrt-h-9 wrt-flex wrt-justify-center wrt-items-center hover:wrt-bg-light-gray"></i>
                }

                // prevPageRel={null}

                breakLabel={"..."}
                pageCount={pageCount}
                forcePage={forcePage}
                // marginPagesDisplayed={1}
                pageRangeDisplayed={3}

                onPageChange={handlePageClick}
                breakClassName={""}

                breakLinkClassName={"wrt-shadow-none wrt-outline-none wrt-border-0"}

                // previousClassName={`${loading && "wrt-pointer-events-none"}`}

                nextClassName={`${loading && "wrt-pointer-events-none"}`}
                disabledClassName="wrt-disabled"

                // onPageActive={true}
                pageLinkClassName={
                    'wrt-px-4 wrt-py-3 wrt-outline-none hover:wrt-bg-secondary '
                }

                activeLinkClassName={
                    'wrt-text-secondary wrt-outline-none  wrt-rounded wrt-border wrt-bg-primary  '
                }

                activeClassName={''}

                containerClassName={
                    "wrt-flex wrt-items-center wrt-justify-end wrt-gap-1.5"
                }
            />
        </div>

    </div>)
};