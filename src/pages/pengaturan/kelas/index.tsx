import Link from "next/link";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";
import { ModalDetail } from "@/pages/components/Modal";
import KelasEdit from "./edit";
import CardKelas from "@/pages/components/card/CardKelas";
import HeadTable from "@/pages/components/HeadTable";
import CreateKelas from "./create";
import DeleteKelas from "./delete";

interface Kelas {
  id: string;
  nama_kelas: string;
  createdAt: Date;
  updatedAt: Date;
}



const Kelas: FC<Kelas> = () => {
  const { data: kelas, error } = useSWR<Kelas[]>("/api/kelas", fetcher, {});

  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);

  // delete selected
  const [showDelete, setShowDelete] = useState<Kelas | null>(null);

  const [showCreate, setShowCreate] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccess(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showSuccess]);

  useEffect(() => {
    if (error) {
    }
  }, [error]);


  const onClose = () => {
    setSelectedKelas(null);
  };

  return (
    <div className="h-full p-10 bg-Neutral-95">
      <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
        <HeadTable label="Kelas"
          onClick={
            () => setShowCreate(true)
          }
        />
        <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
          {kelas ? (
            <>
              {kelas.length === 0 ? (
                <p>No kelas found.</p>
              ) : (
                kelas.map((kelas) => (
                  <CardKelas key={kelas.id} nama_kelas={kelas.nama_kelas}
                    onEdit={() => setSelectedKelas(kelas)}
                    onDelete={() => setShowDelete(kelas)}
                  />
                ))
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
          <Link href="/pengaturan">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              kembali
            </button>
          </Link>
          {selectedKelas && (
            <ModalDetail
              titleModal="Edit Kelas"
              onOpen={true}
              onClose={onClose}
            >
              <KelasEdit
                kelasId={selectedKelas.id}
                data={selectedKelas}
                onClose={onClose}
              />
            </ModalDetail>
          )}
          {showSuccess && (
            <ModalDetail
              titleModal="Edit Kelompok"
              onOpen={true}
              onClose={() => setShowSuccess(false)}
            >
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-green-500">Berhasil</h1>
                <p className="text-sm text-gray-500">
                  {selectedKelas?.nama_kelas}Data berhasil diubah
                </p>
              </div>
            </ModalDetail>
          )}

          {/* modal create */}
          {showCreate && (
            <ModalDetail
              titleModal="Tambah Pengguna"
              onOpen={true}
              onClose={() => setShowCreate(false)}
            >
              <CreateKelas
                onClose={() => setShowCreate(false)}
                onSucsess={() => {
                  setShowSuccess(true);
                }}

              />
            </ModalDetail>
          )}
          {
            showDelete && (
              <ModalDetail
                titleModal="Hapus Kelas"
                onOpen={true}
                onClose={() => setShowDelete(null)}
              >
                <DeleteKelas
                  data={showDelete}
                  onClose={() => setShowDelete(null)}
                  onSucsess={() => {
                    setShowSuccess(true);
                  }}
                  kelasId={showDelete.id}
                />
              </ModalDetail>
            )
          }


        </div>
      </div>
    </div>
  );
};

export default Kelas;
