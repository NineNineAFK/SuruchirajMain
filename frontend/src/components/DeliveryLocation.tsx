import React, { useState } from "react";

type LocationType = {
  state: string;
  district: string;
  pincode: string;
};

const DeliveryLocation = () => {
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState<LocationType | null>(null);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPincode(value);

    if (value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();

        if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
          const place = data[0].PostOffice[0];
          setLocation({
            state: place.State,
            district: place.District,
            pincode: value,
          });
          setError("");
        } else {
          setLocation(null);
          setError("Invalid pincode.");
        }
      } catch {
        setLocation(null);
        setError("Something went wrong.");
      }
    } else {
      setLocation(null);
      setError("");
    }
  };

  return (
    <p className="flex flex-wrap items-center gap-1">
      <span className="text-yellow-400 font-heading text-lg font-semibold">
        Deliver to:
      </span>{" "}
      {!location ? (
        <input
          type="text"
          value={pincode}
          onChange={handleChange}
          maxLength={6}
          placeholder="Enter pincode"
          className="border border-yellow-400 bg-transparent px-3 py-1 w-[120px] text-sm font-sans dark:text-white text-gray-500 dark:placeholder-white placeholder-black rounded-full"
        />
      ) : (
        <>
          {location.state} – {location.district}{" "}
          <span className="font-sans">{location.pincode}</span>
        </>
      )}
      {error && (
        <span className="text-red-500 text-xs ml-2">{error}</span>
      )}
    </p>
  );
};

export default DeliveryLocation;
