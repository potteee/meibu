import React from 'react'

export default function GLoading () {
    return (
        <>
        {/* ここでスタイルやコンポーネントを読み込むと、スーパーリロード時にそれらが読み込まれずに表示が崩れる
        許容できるのはせいぜい、テキスト。リリース時にはnullにする。 */}
            ...GLoading...
        </>
    )
}