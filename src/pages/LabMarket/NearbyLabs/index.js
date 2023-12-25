const geolocationPermission = navigator.permissions.query({ name: 'geolocation' });

geolocationPermission.then((result) => {
  if (!(result.state === 'granted' || result.state === 'denied')) {
    const guest_id = uuidv4();
    const nearbyLabsLocationDetails = {
      latitude,
      longitude,
      search_type: this.state.search_type,
      address: this.state.address,
      city: this.state.city,
      km: this.state.km,
      LabType: this.state.LabType,
      name: this.state.name,
      locationAccessAllowed: this.state.locationAccessAllowed,
      guest_id,
    };
    console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
    this.setState({ guest_id });
    // Call onGetNearbyLabs before prompting for geolocation
    onGetNearbyLabs(nearbyLabsLocationDetails);
    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs });
    }, 500);
    console.log('Geolocation permission status:', result.state);
    return;
  }
});