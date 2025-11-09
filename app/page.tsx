import Image from 'next/image'
import Link from 'next/link'
import Editor from '@/app/components/editor'

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="mb-3">
        <p>'Select File' 버튼으로 이미지를 선택하시고, 이미지 위를 드래그 해서 가려보세요.</p>
      </div>
      <Editor />
      <div className="w-full flex justify-center items-center mt-3">
        <Link href="https://github.com/tyange/canvas-playground">
          <Image src="/github.svg" alt="Github icon" width={24} height={24} />
        </Link>
      </div>
    </div>
  )
}
