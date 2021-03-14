<template>
  <div id="app">
    <h1>Tu oro: {{ myGold }}</h1>
    <div class="locations__container">
      <Location
        v-for="location in locations"
        :key="location.id"
        :location="location"
      ></Location>
    </div>
    <div class="activities">
      <p v-for="activity in activities" :key="activity.id">
        <template v-if="activity.earnsGold">
          <!-- Mensaje cuando se gana oro. -->
          Earned {{ activity.gold }} gold from the {{ activity.location }}!
          {{ activity.time }}
        </template>
        <template v-else>
          <!-- Mensaje cuando se pierde oro. -->
          Lost {{ activity.gold }} gold from the {{ activity.location }} :(
          {{ activity.time }}
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import Location from "@/components/Location.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      activities: []
    };
  },
  components: { Location },
  computed: {
    ...mapState(["myGold", "locations", "lastPlay"])
  },
  methods: {
    ...mapActions(["getLocations"])
  },
  watch: {
    // Para generar array activities con las jugadas historicas
    lastPlay: function() {
      this.activities.push({ ...this.lastPlay, id: this.activities.length });
    }
  },
  mounted() {
    this.getLocations();
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.locations__container {
  display: flex;
  justify-content: space-between;
}
.activities {
  border: 1px solid #000;
  margin-top: 2em;
  padding: 2em 3em;
  p {
    margin-bottom: 1.4em;
    &:first-child {
      margin-top: 0;
    }
    // &:last-child {
    //   margin-bottom: 0;
    // }
  }
  max-height: 30vh;
  overflow-y: scroll;
}
</style>
