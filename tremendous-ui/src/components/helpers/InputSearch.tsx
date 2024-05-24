import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button"

type InputSearchProps = {
    search: string,
    setSearch: any,
    onclick: any
}

const InputSearch = ({ search, setSearch, onclick }: InputSearchProps) => {

    return (
        <div className="wrt-items-stretch wrt-flex wrt-justify-between wrt-gap-2">
            <div className='wrt-relative'>
                <i className="rwt rwt-search wrt-text-lg wrt-absolute wrt-top-3 wrt-left-4"></i>
                <Input
                    className="wrt-text-primary !wrt-px-12 !wrt-w-340px wrt-text-sm wrt-font-medium wrt-grow wrt-whitespace-nowrap wrt-outline-none"
                    placeholder="search" onChange={(e: any) => {
                        setSearch(e.target.value)
                    }} value={search}>
                </Input>
                {search ? (<i onClick={() => {
                    setSearch('')
                    onclick('')
                }}
                    className="rwt rwt-close wrt-text-lg wrt-cursor-pointer wrt-absolute wrt-top-3 wrt-right-4"></i>
                ) : null}
            </div>
            <div>
                <Button
                    className={`wrt-text-neutral-100 !wrt-h-10  wrt-text-sm wrt-font-semibold wrt-whitespace-nowrap wrt-justify-center wrt-items-stretch  wrt-px-4 pwrt-y-3 wrt-rounded-lg ${search.length ? '' : 'wrt-opacity-30'}`}
                    onClick={() => {
                        onclick(search)

                    }} disabled={!search.length}>
                    Search
                </Button>
            </div>
        </div>
    )
}

export default InputSearch;