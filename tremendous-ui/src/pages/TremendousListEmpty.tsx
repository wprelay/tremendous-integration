import React from "react";

export const TremendousListEmpty = () => {
    return (
        <div className="wrt-flex wrt-items-center wrt-flex-col wrt-justify-center wrt-text-center wrt-h-full">
            <div className="wrt-mx-auto wrt-my-auto wrt-flex wrt-flex-col wrt-gap-5 wrt-p-5">
                <div><i className="rwp rwp-list-empty wrt-text-6xl "></i></div>
                <div><span className="wrt-text-lg wrt-font-bold">No Payouts Yet</span></div>
                <div>
                    <p className="wrt-text-sm ">Uh oh, Your Payments Made Via Tremendous</p>
                </div>
            </div>
        </div>
    )
}