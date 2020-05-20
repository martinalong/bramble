import React from 'react'

export default function Error(props) {
    if (props.type === "onboarding") {
        return (
            <div>
                <p>It looks like you aren't onboarded yet. Please check your email for a link to finish signing up</p>
            </div>
        )
    }
    return (
        <div className="page">
            Hello from error!
        </div>
    )
}
