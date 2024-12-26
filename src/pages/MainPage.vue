<template>
    <div class="central">
        <img src="~assets/buglogo.png" class="responsive-img">
    </div>
</template>

<script>

</script>

<style>
  .central{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .responsive-img {
    width: 100%;
    height: auto;
    max-width: 850px;
  }

  @media (max-width: 600) {
    .responsive-img {
      width: 80%;
    }
  }
</style>