import React, {useState} from "react";
import {Card} from "../components/ui/card";
import {axiosClient} from "../components/axios";
import {toastrError} from "../ToastHelper";
import {useLocalState} from "../zustand/localState";
import Select from 'react-select';
import useInputSearch from "../components/customHooks/useInputSearch";
import InputSearch from "../components/helpers/InputSearch";
import {Pagination} from "../components/General/Pagination";
import {ClipLoader} from "react-spinners";
import usePaginationHook from "../components/customHooks/usePaginationHook";
import {override} from "../data/overrride";
import {PaginationTypes} from "../components/types/PaginationTypes";
import {Badge} from "../components/ui/badge";
import {TremendousListEmpty} from "./TremendousListEmpty";
import GoBackButton from "../components/General/GoBackButton";

type TremendousItemEachEntryProp = {
    receiver_email: string,
    affiliate_id: string,
    payout_id: string,
    currency_code: string,
    amount: string,
    status: string,
    tremendous_order_id: string,
};

type payoutItemProps = PaginationTypes & {
    reward_entries: TremendousItemEachEntryProp[]
}

export const TremendousList = () => {
    const [tremendousItems, setTremendousItems] = useState<null | payoutItemProps>(null)
    const {localState} = useLocalState();
    const [loading, setLoading] = useState<boolean>(false)
    const [statusFilter, setStatusFilter] = useState<{ label: string, value: string }[]>([]);
    const {search, setSearch, searched, setIsSearched} = useInputSearch()
    const {
        handlePagination, updatePerPage,
        selectedLimit, perPage, currentPage
    } = usePaginationHook();

    const statusOptions = [
        {
            'label': 'Success',
            'value': 'success'
        },
        {
            'label': 'Failed',
            'value': 'failed'
        },
        {
            'label': 'Pending',
            'value': 'pending'
        }
    ];
    const getItems = (searchValue = '') => {
        setLoading(true)
        axiosClient.get('?action=wp_relay_tremendous', {
            params: {
                method: 'tremendous_rewards_list',
                _wp_nonce_key: 'tremendous_nonce',
                _wp_nonce: localState?.nonces?.wpr_tremendous_nonce,
                search: searchValue,
                status: statusFilter.map((i:any) => i.value),
                per_page: perPage,
                current_page: currentPage
            },

        }).then((response) => {
            setTremendousItems(response.data.data)
        }).catch(response => {
            toastrError('Error Occurred')
        }).finally(() => {
            setLoading(false)
        })
    }

    React.useEffect(() => {
        getItems();
    }, [currentPage, perPage, statusFilter])

    return <div className='wrt-py-2'>
        <div className='wrt-flex wrt-justify-between wrt-my-4 wrt-mx-5'>
            <div
                className='wrt-flex wrt-justify-between lg:wrt-gap-8 wrt-items-center md:wrt-gap-8 wrt-gap-4'>
                <span className='wrt-flex wrt-gap-2 wrt-items-center  '>
                    <span
                        className='lg:wrt-text-xl md:wrt-text-lg wrt-text-sm wrt-text-primary wrt-font-bold'>Tremendous Orders List</span>
                </span>
            </div>
            <div>
                <GoBackButton/>
            </div>
        </div>
        {!loading ? (<div className="wrt-bg-white wrt-h-full wrt-rounded-2xl wrt-p-4">
            <div className="wrt-flex wrt-flex-row wrt-justify-between wrt-items-center search-section wrt-py-2">
                <div>
                    <Select className="xl:wrt-min-w-350px"
                            placeholder='Filter by status' isMulti={true} styles={{
                        option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                            return {
                                ...styles,
                                backgroundColor: isFocused ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                                color: isFocused ? "hsl(var(--secondary))" : "hsl(var(--primary))"
                            };
                        }
                    }}
                            classNamePrefix="wrt-"
                            onChange={(selectedOption: any) => {
                                setStatusFilter(selectedOption)
                            }}
                            options={statusOptions}
                            defaultValue={statusFilter.length > 0 ? statusFilter : ''}
                    ></Select>
                </div>
                <InputSearch search={search} setSearch={setSearch} onclick={getItems}></InputSearch>
            </div>

            {
                searched && tremendousItems?.reward_entries?.length == 0 ? (
                    <div
                        className="wrt-flex wrt-items-center wrt-flex-col wrt-justify-center wrt-text-center wrt-h-full">
                        <div className="wrt-mx-auto wrt-my-auto wrt-flex wrt-flex-col wrt-gap-5 wrt-p-5">
                            <div><i className="wpr wpr-list-empty wrt-text-6xl "></i></div>
                            <div><span className="wrt-text-lg wrt-font-bold">The sale detail you are looking for is not found</span>
                            </div>
                            <div>
                                <p className="wrt-text-sm ">Uh oh, your order list is looking a little empty!
                                    Looks like the search didn't return any results.</p>
                            </div>

                        </div>
                    </div>
                ) : !searched && tremendousItems?.reward_entries?.length == 0 ? <TremendousListEmpty/> : (
                    <>
                        <div className="wrt-h-full">
                            <div className='wrt-flex wrt-flex-col wrt-gap-4'>
                                <div className='wrt-flex wrt-justify-between wrt-mt-5 wrt-w-full wrt-px-4'>
                                    <div
                                        className=' wrt-text-grayprimary wrt-font-bold xl:wrt-text-xs md:wrt-text-2.5 wrt-w-1/4 wrt-text-2.5 wrt-uppercase'>Receiver Email</div>
                                    <div
                                        className=' wrt-text-grayprimary wrt-font-bold xl:wrt-text-xs md:wrt-text-2.5 wrt-w-1/4 wrt-text-2.5 wrt-uppercase'>Order Id</div>
                                    <div
                                        className=' wrt-text-grayprimary wrt-font-bold xl:wrt-text-xs md:wrt-text-2.5 wrt-w-1/6 wrt-text-2.5 wrt-uppercase'>Amount
                                    </div>
                                    <div
                                        className=' wrt-text-grayprimary wrt-font-bold xl:wrt-text-xs md:wrt-text-2.5 wrt-w-1/7 wrt-text-2.5 wrt-uppercase'>Status</div>

                                </div>
                                <div className='wrt-flex wrt-flex-col wrt-gap-4'>
                                    {
                                        tremendousItems?.reward_entries.map((item: TremendousItemEachEntryProp, index: any) => {
                                            return (

                                                <Card key={index}
                                                      className='wrt-flex wrt-justify-between wrt-p-4 !wrt-shadow-md wrt-h-18 wrt-items-center'>
                                                    <div
                                                        className="wrt-text-primary xl:wrt-text-sm wrt-font-bold lg:wrt-text-xs md:wrt-text-2.5  wrt-text-2.5 wrt-w-1/4 ">#{item.receiver_email}</div>
                                                    <div
                                                        className="wrt-text-primary xl:wrt-text-sm wrt-font-bold lg:wrt-text-xs md:wrt-text-2.5  wrt-text-2.5 wrt-w-1/4 ">{item.tremendous_order_id ? item.tremendous_order_id : ''}</div>
                                                    <div
                                                        className="wrt-text-primary xl:wrt-text-sm wrt-font-bold lg:wrt-text-xs md:wrt-text-2.5  wrt-text-2.5 wrt-w-1/6 ">{item.amount ? (
                                                        <span>{item.amount} {item.currency_code}</span>) : null}</div>
                                                    <div className='wrt-w-1/7'>
                                                        <Badge
                                                            className={`${item.status != "success" ? 'wrt-bg-red-600 hover:wrt-bg-red-600' : '!wrt-bg-green-600 hover:wrt-bg-green-600'} `}>{item.status}</Badge>
                                                    </div>
                                                </Card>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className='wrt-flex wrt-justify-end wrt-items-center wrt-my-4'>
                                <div className="pagination">
                                    <Pagination handlePageClick={handlePagination} updatePerPage={updatePerPage}
                                                selectedLimit={selectedLimit} pageCount={tremendousItems?.total_pages || 1}
                                                limit={tremendousItems?.per_page || 5} loading={false}
                                                forcePage={currentPage - 1}/>
                                </div>
                            </div>

                        </div>
                    </>
                )
            }
        </div>) : (<div className="wrt-h-[65vh] rwr-w-full wrt-flex">
            <ClipLoader className="wrt-text-primary" cssOverride={override}/>
        </div>)}
    </div>
}