import { FC, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { mutate } from "swr";
import {
    SubmitHandler,
    useForm
} from "react-hook-form";
import Input from "@/pages/components/inputs/Input";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Button from "@/pages/components/buttons/Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface RuangCreateProps {
    onClose: () => void;
    onSucsess: () => void;
}

const schema = yup.object().shape({
    nama_ruang: yup
        .string()
        .required("tidak boleh kosong")
        .min(3, "nama ruang minimal 3 karakter"),
    tipe: yup.string().required("Pilih Tipe Terlebih Dahulu"),
});

type FormData = yup.InferType<typeof schema>;



const Create: FC<RuangCreateProps> = ({ onClose, onSucsess }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const { nama_ruang, tipe } = data;

        setIsLoading(true); // Set loading state to true
        setError(null);

        try {
            await axios.post(`/api/ruang`, {
                nama_ruang,
                tipe,
            });

            mutate("/api/ruang");
            onClose(); // Set loading state to false

        } catch (error: any) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.log("Response data:", axiosError.response.data);
                    console.log("Response status:", axiosError.response.status);

                    const responseData = axiosError.response.data as { message: string };

                    // Extract the main error message from the response data
                    const errorMessage = responseData.message;

                    setError(`An error occurred: ${errorMessage}`);
                } else if (axiosError.request) {
                    console.log("No response received:", axiosError.request);

                    const request = axiosError.request.toString();
                    setError(`No response received: ${request}`);
                } else {
                    console.log("Error setting up the request:", axiosError.message);

                    const request = axiosError.message.toString();
                    setError(`Error setting up the request: ${request}`);
                }
            } else {
                console.log("Error:", error.message);
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    const [isListOpenTipe, setIsListOpenTipe] = useState(false);
    const componentRef = useRef<HTMLUListElement>(null);

    const tipeOptions = [
        { value: "KELAS", label: "KELAS" },
        { value: "RUMAH", label: "RUMAH" },
    ];

    useEffect(() => {
        // Menangani klik di luar komponen
        const handleOutsideClick = (event: any) => {
            if (
                componentRef.current &&
                !componentRef.current.contains(event.target)
            ) {
                setIsListOpenTipe(false);
            }
        };

        // Menambahkan event listener ketika komponen di-mount
        document.addEventListener("mousedown", handleOutsideClick);

        // Membersihkan event listener ketika komponen di-unmount
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setIsListOpenTipe, componentRef]);

    const toggleListTipe = () => {
        setIsListOpenTipe(!isListOpenTipe);
    };

    const selectTipe = (tipe: string) => {
        setValue("tipe", tipe);
        setIsListOpenTipe(false);
    };

    const getTipeLabel = (value: string) => {
        const option = tipeOptions.find((option) => option.value === value);
        return option ? option.label : "";
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" >
            {/* Error message */}
            {error && <p className="text-red-500">{error}</p>}
            <Input
                id="nama_ruang"
                label="Nama Ruang"
                type="text"
                register={{ ...register("nama_ruang") }}
                errors={errors}
            />
            {errors.nama_ruang && <p className="text-red-500">{errors.nama_ruang.message}</p>}

            <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-sm text-Primary-10">
                    Tipe Ruang
                </label>

                <div className="relative flex flex-col gap-2">
                    <button
                        type="button"
                        className={` w-full h-10 px-4 text-left outline-none rounded-full flex justify-between items-center ${isListOpenTipe
                            ? "border-[2px] border-Primary-50 bg-Primary-95"
                            : "bg-Neutral-95"
                            }`}
                        onClick={toggleListTipe}
                    >
                        {getTipeLabel(watch("tipe")) || ("Pilih Tipe")}
                        {isListOpenTipe ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    {isListOpenTipe && (
                        <ul className="absolute w-full top-[44px] z-10 bg-Neutral-100 border-[2px] border-Primary-50 rounded-xl py-2 px-2 outline-none appearance-none flex flex-col gap-1" ref={componentRef}>
                            {tipeOptions.map((option) => (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        className={`w-full text-left px-2 py-1 rounded-full ${watch("tipe") === option.value
                                            ? "text-Primary-90 bg-Primary-20"
                                            : "text-Primary-20 hover:bg-Primary-95"
                                            }`}
                                        onClick={() => selectTipe(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {errors.tipe && (
                    <span className="text-red-500">{errors.tipe.message}</span>
                )}
            </div>

            {/* Buat selected berisi SUPER ADMIN dan TENTOR */}
            <div className="flex flex-row justify-end">
                <Button
                    type="submit"
                    bgColor="bg-Tertiary-50"
                    brColor=""
                    label="Konfirmasi"
                    textColor="text-Neutral-100"
                    withBgColor
                />
            </div>
        </form>
    );
};

export default Create;