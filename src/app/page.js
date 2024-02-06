"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineCloseCircle, AiOutlineCopy, AiOutlineLink, AiOutlineDownload, AiOutlineShareAlt, AiOutlineCloudSync, AiOutlineGithub } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import { saveAs } from 'file-saver';
import { isMobile } from 'react-device-detect';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [knowunityUrlInput, setKnowunityUrlInput] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  const generateUrl = () => {
    const match = knowunityUrlInput.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/);
    const extractedId = match ? match[0] : null;

    if (extractedId) {
      const loader = toast.loading('Fetching URL');
      const apiUrl = `https://apiedge-eu-central-1.knowunity.com/knows/${extractedId}`;

      axios.get(apiUrl)
        .then(response => {
          const firstDoc = response.data.documents[0];
          setContentUrl(firstDoc.contentUrl);
          setPreviewImageUrl(response.data.thumbnailSmallUrl);
          toast.dismiss(loader);
          toast.success('URL fetched');
        })
        .catch(error => {
          console.error('Error fetching API data:', error);
          toast.error('Failed to fetch URL. Please try again later.');
        });
    } else {
      toast.error('Invalid KnowUnity link. Make sure that a correct URL or ID is entered.');
      setKnowunityUrlInput('');
    }
  };

  const deleteAction = () => {
    if (!knowunityUrlInput) return;
    setKnowunityUrlInput('');

    if (contentUrl) setContentUrl('');

    toast.success('URL cleared');
  }

  const copyAction = () => {
    if (!contentUrl) return;
    navigator.clipboard.writeText(contentUrl)
      .then(() => toast.success('URL copied to clipboard'))
      .catch(() => toast.error('Failed to copy URL to clipboard'));
  }

  const shareAction = () => {
    if (!contentUrl) return;

    if (isMobile && navigator.share) {
      navigator.share({
        title: 'KnowUnity URL',
        url: contentUrl
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      toast.error('Web Share API not supported');
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-none">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        limit={3}
        theme='dark'
      />
      <div className="max-w-lg w-full space-y-8 bg-[#222222] bg-opacity-20 border-2 border-[#333333] p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-[#333333] hover:border-purple-600 hover:bg-opacity-40">
        <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">KnowUnity Downloader</h2>
        {/* URL Input & generate Button*/}
        <div className="flex items-center">
          <input
            type="text"
            value={knowunityUrlInput}
            onChange={e => {
              setKnowunityUrlInput(e.target.value);
              if (e.target.value) {
                setContentUrl('');
              }
            }}
            className="appearance-none rounded relative min-w-32 flex-grow px-3 py-2 border-2 border-purple-700 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 bg-[#222222] bg-opacity-50"
            placeholder="Enter KnowUnity URL"
          />

          {/* Clear Input Button */}
          <button
            onClick={() => deleteAction()}
            className={`group relative flex ml-2 justify-center py-3 px-3 coloring_purple ${knowunityUrlInput ? '' : 'opacity-50 cursor-not-allowed'}`}
          >
            <AiOutlineCloseCircle />
          </button>
        </div>

        <button
          onClick={knowunityUrlInput ? generateUrl : null}
          className={`group relative w-full flex flex-glow items-center justify-center py-2 px-4 coloring_purple mt-4 ${knowunityUrlInput ? '' : 'opacity-50 cursor-not-allowed'}`}
        >
          <AiOutlineCloudSync className="mr-1" />
          Generate URL
        </button>
        {contentUrl && (
          <div className="mt-4">
            {/* grey thin  line */}
            <div className="border-t border-gray-500 opacity-50 w-full"></div>

            <label className="p-3 block text-xl font-medium text-gray-200 mb-2 text-center">Preview Image</label>

            {/* Preview Image */}
            <div className="mt-4 flex justify-center">
              <Link
                href={contentUrl}
                rel='noreferrer noopener'
                target='_blank'
              >
                <Image
                  src={previewImageUrl}
                  alt="Preview Image"
                  className="rounded-lg h-96 w-96 object-contain"
                  width={400}
                  height={200}
                />
              </Link>
            </div>

            {/* Content URL */}
            <label className="p-3 block text-xl font-medium text-gray-200 mb-2 text-center">Content URL</label>
            <div className="flex flex-col items-start space-y-2">
              <div className="w-full flex items-center space-x-2">
                <button
                  onClick={() => copyAction()}
                  className="p-3 coloring_purple"
                >
                  <AiOutlineCopy />
                </button>
                <input
                  type="text"
                  readOnly
                  value={contentUrl}
                  className="appearance-none rounded relative min-w-32 flex-grow px-3 py-2 border-2 border-purple-700 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 bg-[#222222] bg-opacity-50"
                />

                <button
                  onClick={() => shareAction()}
                  className="p-3 coloring_purple"
                >
                  <AiOutlineShareAlt />
                </button>
              </div>
              <div className="flex space-x-2 w-full">
                <button
                  onClick={() => window.open(contentUrl, '_blank')}
                  className="flex items-center justify-center p-2 coloring_purple flex-grow h-10 flex-1"
                >
                  <AiOutlineLink className="mr-1" /> Open
                </button>
                <button
                  onClick={() => saveAs(contentUrl, (contentUrl.split('/').pop()) || 'knowunity.pdf')}
                  className="flex items-center justify-center p-2 coloring_purple flex-grow h-10 flex-1"
                >
                  <AiOutlineDownload className="mr-1" /> Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GitHub Link */}
      <Link
        href="https://github.com/DemonMartin/knowunity-downloader"
        rel='noreferrer noopener'
        target='_blank'
        className="mt-4 flex items-center space-x-2 text-gray-200 hover:text-gray-300"
      >
        <AiOutlineGithub size={25}/>
      </Link>
    </main>
  );
}